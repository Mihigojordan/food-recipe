import requests
import json

API_KEY = '6b36479652f2a371c3fa2c030af5f7dc'  # Replace with your actual API key
IMAGE_API_URL = 'https://api.openai.com/v1/images/generations'

def generate_ai_image(recipe_name, ingredients):
    """Generate an AI image based on the recipe name and ingredients."""
    prompt = f"Create an image of {recipe_name} with ingredients: {', '.join(ingredients)}."
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'prompt': prompt,
        'n': 1,
        'size': '512x512'  # Specify the size of the image
    }
    
    try:
        response = requests.post(IMAGE_API_URL, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        image_url = response.json().get('data')[0].get('url')
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return None  # Return None if image generation fails
