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
import csv
import tldextract
from nltk.metrics import edit_distance

# --- Constants e paths ---
PHISHTANK_API = "https://checkurl.phishtank.com/checkurl/"
OPENPHISH_API = "https://openphish.com/feed.txt"
BASE_DIR = os.path.dirname(__file__)
DYNAMIC_DNS_FILE = os.path.join(BASE_DIR, "data", "dyn_dns_list.txt")
OFFICIAL_DOMAINS_FILE = os.path.join(BASE_DIR, "data", "top-1m.csv")
LEVENSHTEIN_THRESHOLD = 0.2
MAX_OFFICIAL_CHECK = 50000

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
    brand_similarity: bool
    suspicious_redirects: bool
    suspicious: bool

# --- Lifespan ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        with open(DYNAMIC_DNS_FILE, "r") as f:
            app.state.dynamic_dns_providers = set(line.strip() for line in f if line.strip())
        print(f"[startup] Loaded {len(app.state.dynamic_dns_providers)} DDNS providers")
    except Exception as e:
        app.state.dynamic_dns_providers = set()
        print(f"[startup] DDNS load error: {e}")
    try:
        with open(OFFICIAL_DOMAINS_FILE, newline="") as csvfile:
            reader = csv.reader(csvfile)
            app.state.official_domains = [row[1].strip().lower() for row in reader if len(row) >= 2]
        print(f"[startup] Loaded {len(app.state.official_domains)} official domains")
    except Exception as e:
        app.state.official_domains = []
        print(f"[startup] Official domains load error: {e}")
    try:
        resp = requests.get(OPENPHISH_API, timeout=5)
        resp.raise_for_status()
        app.state.openphish_cache = set(line.strip() for line in resp.text.splitlines() if line.strip())
        print(f"[startup] Loaded {len(app.state.openphish_cache)} OpenPhish URLs")
    except Exception as e:
        app.state.openphish_cache = set()
        print(f"[startup] OpenPhish load error: {e}")
    yield
    app.state.dynamic_dns_providers.clear()
    app.state.official_domains.clear()
    app.state.openphish_cache.clear()
    print("[shutdown] Cleared caches")

app = FastAPI(lifespan=lifespan)

# --- Endpoints ---
@app.post("/analyze", response_model=URLAnalysis)
async def analyze_url(request: URLRequest):
    url_str = str(request.url)
    parsed = urlparse(url_str)
    domain = parsed.netloc.lower()
    # Extrai domínio registrado (remove subdomínios)
    ext = tldextract.extract(domain)
    base_domain = f"{ext.domain}.{ext.suffix}" if ext.domain and ext.suffix else domain

    # 1. PhishTank
    in_phishtank = False
    try:
        data = {"url": url_str, "format": "json"}
        resp = requests.post(PHISHTANK_API, data=data, timeout=5)
        in_phishtank = resp.json().get("results", {}).get("in_database", False)
    except:
        pass

    # 2. OpenPhish
    in_openphish = any(url_str.startswith(m) for m in app.state.openphish_cache)

    # 3. Numeric substitution
    numeric_substitution = bool(re.search(r"\d", base_domain))

    # 4. Excessive subdomains
    excessive_subdomains = domain.count('.') > 2

    # 5. Special characters in URL
    special_chars_in_url = bool(re.search(r"[^\w\-\.:/]", url_str))

    # 6. Dynamic DNS
    dynamic_dns = any(base_domain.endswith(p) for p in app.state.dynamic_dns_providers)

    # 7. Domain age
    domain_age_days = None
    young_domain = None
    try:
        info = whois.whois(base_domain)
        creation = info.creation_date
        if isinstance(creation, list): creation = creation[0]
        if isinstance(creation, datetime):
            delta = datetime.utcnow() - creation
            domain_age_days = delta.days
            young_domain = delta.days < 30
    except:
        pass

    # 8. Brand similarity
    brand_similarity = False
    if base_domain not in app.state.official_domains:
        for official in app.state.official_domains[:MAX_OFFICIAL_CHECK]:
            if official == base_domain:
                continue
            dist = edit_distance(base_domain, official)
            max_len = max(len(base_domain), len(official))
            if max_len and dist > 0 and (dist / max_len) < LEVENSHTEIN_THRESHOLD:
                brand_similarity = True
                break

    # 9. Suspicious redirects
    suspicious_redirects = False
    try:
        head_resp = requests.head(url_str, allow_redirects=True, timeout=5)
        hop_count = len(head_resp.history)
        final_domain = urlparse(head_resp.url).netloc.lower()
        ext_final = tldextract.extract(final_domain)
        base_final = f"{ext_final.domain}.{ext_final.suffix}" if ext_final.domain and ext_final.suffix else final_domain
        if hop_count > 3 or base_final != base_domain:
            suspicious_redirects = True
    except:
        pass

    # Final suspicious
    flags = [
        in_phishtank,
        in_openphish,
        numeric_substitution,
        excessive_subdomains,
        special_chars_in_url,
        dynamic_dns,
        young_domain is True,
        brand_similarity,
        suspicious_redirects
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
        brand_similarity=brand_similarity,
        suspicious_redirects=suspicious_redirects,
        suspicious=suspicious
    )

@app.get("/health")
def health_check(): return {"status": "ok"}

@app.get("/", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(openapi_url=app.openapi_url, title=app.title)
