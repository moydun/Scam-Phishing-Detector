from google import genai

path = "C:\\Users\\emoking\\Downloads\\sample-10.eml"

#GEMINI_API_KEY = "YOUR_API_KEY_HERE"

client = genai.Client(api_key = GEMINI_API_KEY)

# Read .eml file as text
with open(path, "r", encoding="utf-8", errors="ignore") as f:
    eml_content = f.read()

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents=f"""
Categorize this email as:
- safe
- scam
- phishing

Provide short reasoning.

Email:

{eml_content}
""",
)

print(response.text)