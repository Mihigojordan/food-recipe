import json
import random
from recipe_generator.nutrition_calculator import complicated_nutrition_calculator
from recipe_generator.recipe_variation import generate_complex_variation
from recipe_generator.image_generator import generate_ai_image

# Load ingredient data from a JSON file
with open('data/ingredients.json', 'r') as f:
    ingredients_data = json.load(f)

def convoluted_recipe_generator(num_recipes):
    """Generate a list of recipes with nutritional data and AI-generated images."""
    recipes = []
    for i in range(num_recipes):
        ingredient_count = random.randint(3, 7)
        selected_ingredients = random.sample(ingredients_data, ingredient_count)
        nutrition_data = complicated_nutrition_calculator(selected_ingredients)
        variations = generate_complex_variation(selected_ingredients)
        recipe_name = f"Recipe {i + 1}"

        # Generate an AI image based on the recipe name and ingredients
        image_url = generate_ai_image(recipe_name, selected_ingredients)

        recipes.append({
            "name": recipe_name,
            "ingredients": selected_ingredients,
            "nutrition": nutrition_data,
            "variations": variations,
            "image_url": image_url  # Add AI-generated image URL to the recipe
        })
    return recipes
