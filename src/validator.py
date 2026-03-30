# -------- Food Domain Keywords --------

FOOD_INGREDIENTS = {
    "vegetables": {
        "tomato", "onion", "potato", "carrot", "beans", "peas",
        "spinach", "cabbage", "cauliflower", "brinjal", "capsicum"
    },
    "proteins": {
        "egg", "paneer", "tofu", "soya", "corn", "almonds"
    },
    "grains": {
        "rice", "pasta", "noodles", "bread", "roti", "chapati"
    },
    "dairy": {
        "milk", "cheese", "butter", "curd", "cream", "yogurt"
    },
    "spices": {
        "salt", "pepper", "oil", "garlic", "ginger",
        "turmeric", "cumin", "coriander", "chilli"
    }
}


# -------- Food Intent Keywords --------

FOOD_INTENTS = {
    "cook", "recipe", "make", "prepare", "dish",
    "meal", "food", "ingredients"
}


# -------- Blocked Domains --------

BLOCKED_DOMAINS = {
    "technology": {
        "code", "python", "java", "html", "css", "javascript", "api"
    },
    "academics": {
        "resume", "cv", "essay", "assignment", "project", "thesis"
    },
    "finance": {
        "stock", "crypto", "bitcoin", "trading", "investment"
    },
    "entertainment": {
        "joke", "meme", "movie", "song", "lyrics", "game"
    },
    "news": {
        "politics", "election", "news"
    }
}


# -------- Utility Functions --------

def flatten_keywords(keyword_dict):
    return set().union(*keyword_dict.values())


# -------- Validation Logic --------

def is_valid_food_request(user_input: str) -> bool:

    if not user_input or not user_input.strip():
        return False

    text = user_input.lower()

    all_food_items = flatten_keywords(FOOD_INGREDIENTS)
    all_blocked_words = flatten_keywords(BLOCKED_DOMAINS)

    # 1️⃣ Block code / programming patterns
    if "```" in text or "def " in text or "class " in text:
        return False

    # 2️⃣ Block unwanted domains
    if any(word in text for word in all_blocked_words):
        return False

    # 3️⃣ Block obvious non-food questions
    non_food_patterns = [
        "what is",
        "who is",
        "history of",
        "explain",
        "define",
        "how to code",
        "write code"
    ]

    if any(p in text for p in non_food_patterns):
        return False

    # 4️⃣ Must contain at least one real ingredient
    if not any(word in text for word in all_food_items):
        return False

    # 5️⃣ Input must be meaningful
    if len(text.split()) < 2:
        return False

    return True


# -------- Example Testing --------

if __name__ == "__main__":

    test_inputs = [
        "recipe using tomato and onion",
        "how to cook egg curry",
        "make dish with rice",
        "write python code",
        "tell me a joke",
        "stock market news",
        "resume preparation",
        "egg curry",
        "food",
    ]

    for query in test_inputs:
        print(f"{query} --> {is_valid_food_request(query)}")