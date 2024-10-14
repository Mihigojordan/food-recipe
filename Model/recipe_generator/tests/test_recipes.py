import unittest
from recipe_generator.recipe_model import generate_recipes

class TestRecipeModel(unittest.TestCase):
    def test_generate_recipes(self):
        recipes = generate_recipes(10)  # Generate 10 recipes for testing
        self.assertEqual(len(recipes), 10)
        for recipe in recipes:
            self.assertIn("recipeName", recipe)
            self.assertIn("ingredients", recipe)
            self.assertIn("nutritionalInfo", recipe)
            self.assertIn("variations", recipe)

    def test_nutrition_calculation(self):
        ingredients = ["chicken", "spinach"]
        nutrition = calculate_nutrition(ingredients)
        self.assertGreater(nutrition["totalCalories"], 0)

if __name__ == '__main__':
    unittest.main()
