def calculate_nutrition(ingredients):
    """Calculate total nutritional information based on ingredients."""
    nutrition_data = {
        "totalCalories": 0,
        "carbs": 0,
        "fat": 0,
        "protein": 0,
        "fiber": 0
    }
    
    # Nutritional values (fake data for example)
    nutrition_values = {
        "chicken": {"calories": 335, "carbs": 0, "fat": 15, "protein": 62, "fiber": 0},
        "beef": {"calories": 250, "carbs": 0, "fat": 20, "protein": 26, "fiber": 0},
        "pork": {"calories": 242, "carbs": 0, "fat": 14, "protein": 27, "fiber": 0},
        "tofu": {"calories": 144, "carbs": 4, "fat": 9, "protein": 15, "fiber": 1},
        "spinach": {"calories": 23, "carbs": 3.6, "fat": 0.4, "protein": 2.9, "fiber": 2.2},
        # Add more ingredients as needed...
    }

    for ingredient in ingredients:
        if ingredient in nutrition_values:
            nutrition_data["totalCalories"] += nutrition_values[ingredient]["calories"]
            nutrition_data["carbs"] += nutrition_values[ingredient]["carbs"]
            nutrition_data["fat"] += nutrition_values[ingredient]["fat"]
            nutrition_data["protein"] += nutrition_values[ingredient]["protein"]
            nutrition_data["fiber"] += nutrition_values[ingredient]["fiber"]
    
    return nutrition_data
