from openai import OpenAI

client = OpenAI(api_key="sk-8e922efea11b48ea80e098e7f34cfeb9" , base_url="https://api.deepseek.com/v1")  # se estiver usando DeepSeek compatível

def generar_examen_deepseek(texto: str):
    print("🌐 Iniciando chamada para DeepSeek API...")
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "Eres un generador de exámenes escolares."},
            {"role": "user", "content": f"Genera un examen a partir de este contenido, pero sin dar las respuestas:\n\n{texto}"}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    return response.choices[0].message.content

def generar_respuestas_deepseek(contenido: str, examen: str):
    print("🌐 Enviando contenido y examen a DeepSeek para generar respuestas...")
    prompt = f"""
Dado el siguiente contenido de estudio:

{contenido}

Y este examen:

{examen}

Genera respuestas detalladas para cada pregunta del examen.
"""

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "Eres un experto en educación y generación de respuestas de exámenes."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=1500
    )
    return response.choices[0].message.content