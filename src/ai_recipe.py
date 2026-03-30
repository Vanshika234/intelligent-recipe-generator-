import os
from groq import Groq
from dotenv import load_dotenv
from validator import is_valid_food_request
from prompt_rules import SYSTEM_PROMPT

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_recipe(ingredients):
    if not ingredients:
        return "No ingredients detected"

    if not is_valid_food_request(ingredients):
        return "Only food ingredients allowed"

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": ingredients}
            ],
            temperature=0.5
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"AI Error: {str(e)}"
