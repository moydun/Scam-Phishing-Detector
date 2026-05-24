from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyze import analyze

import requests
import whois
import os
import re

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VT_API_KEY = os.getenv("VT_API_KEY")

URL_REGEX = re.compile(
    r"^(https?://)?"
    r"(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,})"
    r"(:\d+)?"
    r"(/[^\s]*)?"
    r"$"
)


def is_url(text: str) -> bool:
    text = text.strip()
    if len(text.split()) > 1:
        return False
    return bool(URL_REGEX.match(text))


def normalize_url(text: str) -> str:
    text = text.strip()
    if not text.startswith("http://") and not text.startswith("https://"):
        return "https://" + text
    return text


class AnalyzeRequest(BaseModel):
    input: str


def check_virustotal(url):
    if not VT_API_KEY:
        return None
    try:
        headers = {"x-apikey": VT_API_KEY}
        response = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url},
            timeout=10
        )
        if response.status_code != 200:
            return None
        return "checked"
    except Exception:
        return None


def get_whois_info(domain: str):
    try:
        data = whois.whois(domain)
        return {
            "country": data.country,
            "creation_date": str(data.creation_date)
        }
    except Exception:
        return None


@app.post("/analyze")
def analyze_endpoint(request: AnalyzeRequest):
    user_input = request.input.strip()

    input_is_url = is_url(user_input)
    normalized = normalize_url(user_input) if input_is_url else None

    ai_result = analyze(user_input, input_type="url" if input_is_url else "text")

    vt_result = None
    whois_result = None

    if input_is_url and normalized:
        domain = re.sub(r"https?://", "", normalized).split("/")[0]
        vt_result = check_virustotal(normalized)
        whois_result = get_whois_info(domain)

    return {
        "verdict": ai_result.get("verdict"),
        "risk_level": ai_result.get("risk_level"),
        "explanation": ai_result.get("explanation"),
        "input_type": "url" if input_is_url else "text",
        "virustotal": vt_result,
        "whois": whois_result
    }