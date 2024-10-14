def generate_variation(ingredients):
    """Generate variations of the recipe based on ingredient combinations."""
    variations = []
    for i in range(random.randint(1, 3)):  # Random number of variations
        varied_ingredients = ingredients.copy()
        random.shuffle(varied_ingredients)
        variations.append({
            "variationName": f"Variation {i + 1}",
            "ingredients": varied_ingredients[:random.randint(2, len(ingredients))]  # Randomly pick some ingredients
        })
    return variations
