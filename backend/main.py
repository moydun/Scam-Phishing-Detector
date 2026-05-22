import os
import json
import email
from email.policy import default
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load env variables from .env if present
load_dotenv()

app = FastAPI(title="ScamShield API")

# Add CORS Middleware to allow connections from local and deployed frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ScamShield Backend is active and secure."}

@app.post("/api/analyze")
async def analyze_email(
    file: UploadFile = File(None),
    text: str = Form(None)
):
    # Ensure at least one input is provided
    if not file and not text:
        raise HTTPException(status_code=400, detail="Пожалуйста, загрузите EML файл или вставьте текст письма.")
    
    email_subject = "Вручную вставленный текст"
    email_from = "Неизвестный отправитель"
    email_to = "Неизвестный получатель"
    email_date = "Неизвестная дата"
    email_body = ""
    raw_content = ""
    
    if file:
        # Read the file contents
        content_bytes = await file.read()
        raw_content = content_bytes.decode('utf-8', errors='ignore')
        
        try:
            # Parse the EML structure using standard email package
            msg = email.message_from_bytes(content_bytes, policy=default)
            email_subject = msg.get('subject', 'Без темы')
            email_from = msg.get('from', 'Неизвестный отправитель')
            email_to = msg.get('to', 'Неизвестный получатель')
            email_date = msg.get('date', 'Неизвестная дата')
            
            # Extract plain text or HTML body
            if msg.is_multipart():
                parts = []
                for part in msg.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("content-disposition", ""))
                    if "attachment" not in content_disposition:
                        if content_type == "text/plain":
                            parts.append(part.get_payload(decode=True).decode('utf-8', errors='ignore'))
                        elif content_type == "text/html" and not parts:
                            # Save HTML as fallback if plain text isn't found yet
                            parts.append(part.get_payload(decode=True).decode('utf-8', errors='ignore'))
                email_body = "\n".join(parts) if parts else "Содержимое письма пусто."
            else:
                email_body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
        except Exception as e:
            # Fallback if standard EML parsing fails
            email_body = raw_content
    else:
        # Text input only
        email_body = text
        raw_content = text

    # Check for Gemini API key in env
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY не настроен. Пожалуйста, добавьте его в файл .env или настройки Railway."
        )
        
    try:
        # Initialize Google GenAI Client
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
Проанализируй следующее электронное письмо на наличие мошенничества (scam) или фишинга (phishing).
Определи категорию письма и дай подробное объяснение на русском языке.

Данные письма:
- Тема: {email_subject}
- Отправитель: {email_from}
- Получатель: {email_to}
- Дата: {email_date}

Содержимое письма:
\"\"\"
{email_body[:5000]}
\"\"\"

Полный исходный текст письма (включая технические заголовки, если доступны):
\"\"\"
{raw_content[:2000]}
\"\"\"

Верни результат строго в формате JSON со следующей структурой:
{{
  "verdict": "safe" | "scam" | "phishing",
  "confidence": <число от 0 до 100>,
  "reasoning": "<подробное объяснение на русском языке, почему письмо относится к этой категории>",
  "highlights": [
    "<первая подозрительная деталь/красный флаг на русском языке>",
    "<вторая подозрительная деталь на русском языке>",
    ...
  ]
}}
"""
        # Call Gemini model
        # Using gemini-2.5-flash as the highly performant standard model
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # Parse the JSON response
        result_json = json.loads(response.text)
        
        return {
            "success": True,
            "verdict": result_json.get("verdict", "safe"),
            "confidence": result_json.get("confidence", 100),
            "reasoning": result_json.get("reasoning", "Анализ завершен успешно."),
            "highlights": result_json.get("highlights", []),
            "metadata": {
                "subject": email_subject,
                "from": email_from,
                "to": email_to,
                "date": email_date
            }
        }
        
    except json.JSONDecodeError:
        # Fallback if Gemini response is not valid JSON
        return {
            "success": True,
            "verdict": "safe",
            "confidence": 50,
            "reasoning": response.text if 'response' in locals() else "Не удалось разобрать ответ от нейросети.",
            "highlights": [],
            "metadata": {
                "subject": email_subject,
                "from": email_from,
                "to": email_to,
                "date": email_date
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обращении к ИИ Gemini: {str(e)}"
        )