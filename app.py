import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Edamam API credentials
EDAMAM_APP_ID = "96668a25"  # Replace with your Edamam Application ID
EDAMAM_APP_KEY = "6b36479652f2a371c3fa2c030af5f7dc"  # Replace with your Edamam Application Key

def get_recipe_suggestions(ingredients):
    """Fetch recipe suggestions from the Edamam API based on a list of ingredients."""
    try:
        # Prepare the request URL and parameters
        url = "https://api.edamam.com/search"
        params = {
            "q": ",".join(ingredients),  # Ingredients as a comma-separated string
            "app_id": EDAMAM_APP_ID,
            "app_key": EDAMAM_APP_KEY,
            "from": 0,
            "to": 10,  # Number of recipes to retrieve
        }

        print("Request parameters:", params)  # Debugging info

        # Make the request to the Edamam API
        response = requests.get(url, params=params)

        print("Response from Edamam API:", response.status_code, response.text)  # Debugging info

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            print("Full API response:", data)  # Log the full response for better diagnostics

            # Extract recipes from the response
            recipes = []
            if "hits" in data:
                for hit in data["hits"]:
                    recipe = hit["recipe"]
                    recipes.append({
                        "title": recipe["label"],
                        "ingredients": recipe["ingredientLines"],
                        "url": recipe["url"],
                        "image": recipe["image"],
                    })
            else:
                recipes.append({"error": "No recipes found."})

            return recipes  # Return the list of recipes
        else:
            print(f"Error from Edamam API: {response.status_code}, {response.text}")
            return [{"error": "Could not retrieve recipes at this time."}]
    except Exception as e:
        print("Error communicating with Edamam API:", e)
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
