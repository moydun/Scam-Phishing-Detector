import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze(user_input: str, input_type: str = "text") -> dict:
    if input_type == "url":
        context = f"""You are a cybersecurity AI specialized in detecting malicious URLs.
Analyze this URL and determine if it is phishing, scam, or safe.
Look for: suspicious domain names, typosquatting, fake brand names, unusual TLDs, URL shorteners, misleading paths.

URL: {user_input}"""
    else:
        context = f"""You are a cybersecurity AI specialized in detecting scam messages.
Analyze this text message and determine if it is a scam, phishing, or safe.
Look for: urgency tactics, fake prizes, suspicious requests for personal data, impersonation.

Text: {user_input}"""

    prompt = f"""{context}

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation outside JSON):
{{
  "verdict": "SCAM" | "PHISHING" | "SUSPICIOUS" | "SAFE",
  "risk_level": "HIGH" | "MEDIUM" | "LOW",
  "explanation": "Short explanation in Russian (1-2 sentences)"
}}"""

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        text = response.choices[0].message.content.strip()

        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()

        return json.loads(text)

    except Exception as e:
        return {
            "verdict": "UNKNOWN",
            "risk_level": "MEDIUM",
            "explanation": f"Не удалось выполнить анализ: {str(e)}"
        }
