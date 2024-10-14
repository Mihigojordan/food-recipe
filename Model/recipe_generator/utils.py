import random

def random_choice_with_weights(choices, weights):
    """Select an item from a list with weighted probabilities."""
    return random.choices(choices, weights=weights, k=1)[0]

def validate_nutrition(nutrition_data):
    """Validate nutritional data against dietary guidelines."""
    # Implement validation logic here...
    return True
