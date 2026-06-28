import jwt
print(jwt.encode({"id": "1", "subscriptionTier": "free", "copilotCount": 500, "generationCount": 3}, "generate_a_very_long_secure_random_string_here", algorithm="HS256"))
