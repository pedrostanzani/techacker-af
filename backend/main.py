from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import re
import requests
from contextlib import asynccontextmanager
from scalar_fastapi import get_scalar_api_reference

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
    suspicious: bool

# --- Configurações externas ---
PHISHTANK_API = "https://checkurl.phishtank.com/checkurl/"
OPENPHISH_API = "https://openphish.com/feed.txt"

# --- Lifespan (startup + shutdown) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        resp = requests.get(OPENPHISH_API, timeout=5)
        resp.raise_for_status()
        app.state.openphish_cache = set(
            line.strip() for line in resp.text.splitlines() if line.strip()
        )
    except Exception:
        app.state.openphish_cache = set()
    yield
    app.state.openphish_cache.clear()

app = FastAPI(lifespan=lifespan)

# --- Endpoints ---
@app.post("/analyze", response_model=URLAnalysis)
async def analyze_url(request: URLRequest):
    # Convertemos HttpUrl para string
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

    suspicious = any([
        in_phishtank,
        in_openphish,
        numeric_substitution,
        excessive_subdomains,
        special_chars_in_url
    ])

    return URLAnalysis(
        url=url_str,
        domain=domain,
        in_phishtank=in_phishtank,
        in_openphish=in_openphish,
        numeric_substitution=numeric_substitution,
        excessive_subdomains=excessive_subdomains,
        special_chars_in_url=special_chars_in_url,
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
