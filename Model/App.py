from flask import Flask, jsonify, request
from recipe_generator.recipe_model import generate_recipes
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

@app.route('/generate_recipes', methods=['GET'])
def generate_recipes_endpoint():
    num_recipes = request.args.get('num', default=10, type=int)  # Number of recipes to generate
    recipes = generate_recipes(num_recipes)
    return jsonify(recipes), 200

if __name__ == '__main__':
    app.run(debug=True)
