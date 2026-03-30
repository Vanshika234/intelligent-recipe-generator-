from ai_recipe import generate_recipe

def generate_recipe_from_text(text):
    if not text:
        return "No ingredients detected"
    
    recipe = generate_recipe(text)
    return recipe
