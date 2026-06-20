import re
from collections import Counter

# Hardcoded list of terrible resume buzzwords to flag
BANNED_BUZZWORDS = {
    "synergy", "think outside the box", "go-getter", "detail-oriented", 
    "team player", "hard worker", "thought leader", "guru", "ninja", 
    "rockstar", "dynamic", "results-driven", "self-motivated", "proactive"
}

def check_resume_quality(text: str) -> dict:
    """
    Scans a resume for bad buzzwords and excessively repeated words.
    Blazingly fast rule-based engine.
    """
    text_lower = text.lower()
    
    # 1. Find Buzzwords
    found_buzzwords = []
    for bw in BANNED_BUZZWORDS:
        if bw in text_lower:
            found_buzzwords.append(bw)
            
    # 2. Find Repetition
    # Extract words ignoring punctuation
    words = re.findall(r'\b[a-z]{4,}\b', text_lower)
    
    # Filter out common stop words to only count meaningful verbs/nouns
    stop_words = {"this", "that", "with", "from", "your", "have", "more"}
    filtered_words = [w for w in words if w not in stop_words]
    
    counts = Counter(filtered_words)
    
    # Flag words used more than 4 times
    excessive_repetition = {word: count for word, count in counts.items() if count > 4}
    
    # Generate Feedback
    score = 100
    suggestions = []
    
    if found_buzzwords:
        score -= len(found_buzzwords) * 5
        suggestions.append(f"Remove empty buzzwords: {', '.join(found_buzzwords)}.")
        
    if excessive_repetition:
        score -= len(excessive_repetition) * 5
        rep_list = ", ".join([f"'{w}' ({c} times)" for w, c in excessive_repetition.items()])
        suggestions.append(f"You are repeating these words too much: {rep_list}. Use synonyms.")
        
    if score == 100:
        suggestions.append("Your vocabulary is strong and avoids common buzzwords.")

    return {
        "score": max(0, score),
        "found_buzzwords": found_buzzwords,
        "excessive_repetition": excessive_repetition,
        "suggestions": suggestions
    }
