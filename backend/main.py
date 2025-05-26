from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import re
import requests
import whois
from datetime import datetime
from contextlib import asynccontextmanager
from scalar_fastapi import get_scalar_api_reference
import os

# --- Constants e paths ---
PHISHTANK_API = "https://checkurl.phishtank.com/checkurl/"
OPENPHISH_API = "https://openphish.com/feed.txt"
DYNAMIC_DNS_FILE = os.path.join(os.path.dirname(__file__), "data", "dyn_dns_list.txt")

# --- Modelos ---
class URLRequest(BaseModel):
    url: HttpUrl

class URLAnalysis(BaseModel):
    url: str
    domain: str
    in_phishtank: bool
    in_openphish: bool
    numeric_substitution: bool
    excessive_subdomains: bool
    special_chars_in_url: bool
    dynamic_dns: bool
    domain_age_days: int | None
    young_domain: bool | None
    suspicious: bool

# --- Lifespan (startup + shutdown) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Carrega lista de provedores DDNS de arquivo local
    try:
        with open(DYNAMIC_DNS_FILE, "r") as f:
            app.state.dynamic_dns_providers = set(line.strip() for line in f if line.strip())
        print(f"[startup] Loaded {len(app.state.dynamic_dns_providers)} dynamic DNS providers from {DYNAMIC_DNS_FILE}")
    except Exception as e:
        app.state.dynamic_dns_providers = set()
        print(f"[startup] Failed loading dynamic DNS providers: {e}")

    # Carrega lista do OpenPhish
    try:
        resp = requests.get(OPENPHISH_API, timeout=5)
        resp.raise_for_status()
        app.state.openphish_cache = set(
            line.strip() for line in resp.text.splitlines() if line.strip()
        )
        print(f"[startup] Loaded {len(app.state.openphish_cache)} OpenPhish URLs")
    except Exception as e:
        app.state.openphish_cache = set()
        print(f"[startup] Failed loading OpenPhish list: {e}")

    yield

    # Limpeza de caches ao shutdown
    app.state.dynamic_dns_providers.clear()
    app.state.openphish_cache.clear()
    print("[shutdown] Cleared dynamic DNS and OpenPhish caches")

app = FastAPI(lifespan=lifespan)

# --- Endpoints ---
@app.post("/analyze", response_model=URLAnalysis)
async def analyze_url(request: URLRequest):
    url_str = str(request.url)
    parsed = urlparse(url_str)
    domain = parsed.netloc.lower()

    # 1) PhishTank API
    in_phishtank = False
    try:
        data = {"url": url_str, "format": "json"}
        resp = requests.post(PHISHTANK_API, data=data, timeout=5)
        result = resp.json()
        in_phishtank = result.get("results", {}).get("in_database", False)
    except Exception:
        in_phishtank = False

    # 2) OpenPhish (cache em app.state)
    in_openphish = any(
        url_str.startswith(mal_url) for mal_url in app.state.openphish_cache
    )

    # 3) Dígitos no domínio
    numeric_substitution = bool(re.search(r"\d", domain))

    # 4) Subdomínios excessivos (>2 pontos)
    excessive_subdomains = domain.count('.') > 2

    # 5) Caracteres especiais na URL
    special_chars_in_url = bool(re.search(r"[^\w\-\.:/]", url_str))

    # 6) DNS Dinâmico (lista de providers de arquivo)
    dynamic_dns = any(
        domain.endswith(provider) for provider in app.state.dynamic_dns_providers
    )

    # 7) Idade de domínio (WHOIS)
    domain_age_days = None
    young_domain = None
    try:
        info = whois.whois(domain)
        creation = info.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if isinstance(creation, datetime):
            delta = datetime.utcnow() - creation
            domain_age_days = delta.days
            young_domain = delta.days < 30
    except Exception:
        domain_age_days = None
        young_domain = None

    # Avaliação final
    flags = [
        in_phishtank,
        in_openphish,
        numeric_substitution,
        excessive_subdomains,
        special_chars_in_url,
        dynamic_dns,
        young_domain is True
    ]
    suspicious = any(flags)

    return URLAnalysis(
        url=url_str,
        domain=domain,
        in_phishtank=in_phishtank,
        in_openphish=in_openphish,
        numeric_substitution=numeric_substitution,
        excessive_subdomains=excessive_subdomains,
        special_chars_in_url=special_chars_in_url,
        dynamic_dns=dynamic_dns,
        domain_age_days=domain_age_days,
        young_domain=young_domain,
        suspicious=suspicious
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )
