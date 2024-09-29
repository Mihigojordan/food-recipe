import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Gemini API URL and hardcoded API key
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
API_KEY = "AIzaSyBwnKzqR7LtAF_wm4-MmIw0QafxYLC5RaA"  # Replace with a valid API key

def get_recipe_suggestions(ingredients):
    """Fetch recipe suggestions from the Gemini API based on a list of ingredients."""
    try:
        headers = {
            "Content-Type": "application/json"
        }

        # Convert the list of ingredients to a string for the API query
        ingredients_str = ", ".join(ingredients)

        # Create the payload requesting at least four recipes
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"Suggest at least four recipes based on the following ingredients: {ingredients_str}. Include instructions for each recipe."}
                    ]
                }
            ]
        }

        print("Payload sent to Gemini API:", payload)  # Debugging info

        # Make the request to the Gemini API
        request_url = f"{GEMINI_API_URL}?key={API_KEY}"
        response = requests.post(request_url, headers=headers, json=payload)

        print("Response from Gemini API:", response.status_code, response.text)  # Debugging info

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            print("Full API response:", data)  # Log the full response for better diagnostics

            # Check if 'candidates' is in the response and contains content
            recipes = []
            if 'candidates' in data and isinstance(data['candidates'], list) and len(data['candidates']) > 0:
                for candidate in data['candidates']:
                    # Ensure 'content' is in the candidate
                    if 'content' in candidate and 'parts' in candidate['content']:
                        parts = candidate['content']['parts']
                        recipe_text = " ".join(part['text'] for part in parts)  # Combine all parts into one recipe

                        # Example parsing logic (you might need to refine this)
                        title = recipe_text.split("**")[1].strip() if "**" in recipe_text else "Untitled Recipe"
                        ingredients_section = recipe_text.split("**Ingredients:**")
                        instructions_section = recipe_text.split("**Instructions:**")

                        ingredients = []
                        instructions = []

                        if len(ingredients_section) > 1:
                            ingredients = ingredients_section[1].split("\n*")[1:]  # Adjusting to get the list
                            ingredients = [ingredient.strip().lstrip("*") for ingredient in ingredients if ingredient]

                        if len(instructions_section) > 1:
                            instructions = instructions_section[1].strip().split("\n")[1:]  # Adjusting to skip the first line
                            instructions = [instruction.strip() for instruction in instructions if instruction]

                        recipes.append({
                            "title": title,
                            "ingredients": ingredients,
                            "instructions": instructions
                        })
                    else:
                        print("Warning: Candidate does not contain expected content structure:", candidate)
                        recipes.append({"error": "Recipe structure is not as expected."})

            else:
                recipes.append({"error": "No valid candidates found."})

            return recipes  # Return the list of recipes
        else:
            print(f"Error from Gemini API: {response.status_code}, {response.text}")
            return [{"error": "Could not retrieve recipes at this time."}]
    except Exception as e:
        print("Error communicating with Gemini API:", e)
        return [{"error": "Could not retrieve recipes at this time."}]

@app.route('/api/recipes', methods=['POST'])
def get_recipes():
    """API endpoint to get recipe suggestions based on ingredients."""
    try:
        data = request.get_json()  # Parse the JSON request body
        if not data or 'ingredients' not in data:
            return jsonify({"error": "No ingredients provided."}), 400  # Return 400 error if ingredients are missing

        ingredients = data.get('ingredients', [])

        # Ensure we have a valid list of ingredients
        ingredients_list = [item.strip() for item in ingredients if isinstance(item, str) and item.strip()]

        print("Ingredients list received:", ingredients_list)  # Debugging info

        if ingredients_list:
            # Fetch recipes based on the provided ingredients
            recipes = get_recipe_suggestions(ingredients_list)
            return jsonify(recipes)  # Return the list of recipes as separate objects

        return jsonify([])  # Return an empty list if no valid ingredients were provided
    except Exception as e:
        print("Error processing request:", e)
        return jsonify({"error": "Internal server error."}), 500  # Return 500 error for other exceptions

@app.route('/')  # Route for the root URL
def index():
    """Welcome message for the root URL."""
    return "Welcome to the Recipe API! Use /api/recipes to generate recipes."

if __name__ == '__main__':
    # Run the Flask app with debugging enabled on all network interfaces
    app.run(host='0.0.0.0', port=5000, debug=True)
