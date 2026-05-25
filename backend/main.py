from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import json
from dotenv import load_dotenv 
import os 

load_dotenv()

api_key = os.getenv("API_KEY") 
debug = os.getenv("DEBUG", "False") 

GEMINI_API_KEY = api_key
client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and mount the chat router
from chat import router as chat_router
app.include_router(chat_router)


# =========================
# REQUEST MODEL
# =========================

class ScanRequest(BaseModel):
    text: str


# =========================
# SCANNER ENDPOINT
# =========================

@app.post("/scan")
async def scan(data: ScanRequest):
    prompt = f"""You are a cybersecurity AI agent specialized in detecting online scams, phishing, and malicious content.

Analyze the following message or URL:

{data.text}

Think step by step:
1. Is this a URL or a text message?
2. What suspicious signals do you see? (domain tricks, urgency, prize claims, credential requests, lookalike names, etc.)
3. What category does this fall into?
4. What is the risk level?

Return ONLY valid JSON — no markdown, no backticks, no extra text:

{{
    "status": "SAFE",
    "category": "Phishing",
    "risk": "82%",
    "reason": "One or two sentence explanation of why this is suspicious or safe."
}}

status must be exactly one of: SAFE, SUSPICIOUS, MALICIOUS
category examples: Phishing, Scam, Malware, Spam, Fake Giveaway, Credential Harvesting, Safe
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    try:
        cleaned = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        return result
    except Exception:
        return {
            "status": "SUSPICIOUS",
            "category": "Unknown",
            "risk": "50%",
            "reason": response.text
        }
