from fastapi import FastAPI
from pydantic import BaseModel
from analyze import analyze

import requests
import whois
import os

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

VT_API_KEY = os.getenv("VT_API_KEY")


class AnalyzeRequest(BaseModel):
    input: str


def check_virustotal(url):
    headers = {
        "x-apikey": VT_API_KEY
    }

    response = requests.post(
        "https://www.virustotal.com/api/v3/urls",
        headers=headers,
        data={"url": url}
    )

    if response.status_code != 200:
        return "VirusTotal error"

    return "checked"


def get_whois_info(url):
    try:
        data = whois.whois(url)

        return {
            "country": data.country,
            "creation_date": str(data.creation_date)
        }

    except Exception:
        return "WHOIS error"


@app.post("/analyze")
def analyze_endpoint(request: AnalyzeRequest):

    user_input = request.input

    ai_result = analyze(user_input)

    vt_result = None
    whois_result = None

    if user_input.startswith("http"):

        vt_result = check_virustotal(user_input)
        whois_result = get_whois_info(user_input)

    return {
        "verdict": ai_result.get("verdict"),
        "risk_level": ai_result.get("risk_level"),
        "explanation": ai_result.get("explanation"),
        "virustotal": vt_result,
        "whois": whois_result
    }