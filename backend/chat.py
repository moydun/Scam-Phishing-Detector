from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv 
import os 

load_dotenv()
# =========================
# CONFIG x              
# =========================
api_key = os.getenv("API_KEY") 
debug = os.getenv("DEBUG", "False") 

GEMINI_API_KEY = api_key
client = genai.Client(api_key=GEMINI_API_KEY)

router = APIRouter()


# =========================
# REQUEST MODEL
# =========================

class ChatRequest(BaseModel):
    message: str


# =========================
# CHAT ENDPOINT
# =========================

@router.post("/chat")
async def chat(data: ChatRequest):
    prompt = f"""You are ATLAS, an AI cybersecurity assistant helping users in Kyrgyzstan stay safe online.

Your role:
- Identify scam and phishing patterns in messages users share with you
- Give short, clear, actionable advice
- Warn about common scam tactics: fake prizes, urgent bank alerts, fake job offers, romance scams, etc.
- If the user shares a suspicious message or link, analyze it and explain the red flags
- Keep answers under 4 sentences — be direct and helpful
- Respond in the same language the user writes in (Russian or Kyrgyz preferred)

User message:
{data.message}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {"reply": response.text.strip()}
