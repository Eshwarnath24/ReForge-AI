import json
import os

def load_knowledge_base(path: str = None):
    if path is None:
        # knowledge_base.json lives at server/ root, one level up from services/
        path = os.path.join(os.path.dirname(__file__), "..", "knowledge_base.json")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["projects"]


def prefilter_projects(detected_items: list, all_projects: list, max_results: int = 12):
    detected_terms = []
    for item in detected_items:
        detected_terms.append(item.get("item", "").lower())
        detected_terms.append(item.get("material", "").lower())

    scored = []
    for project in all_projects:
        required = [r.lower() for r in project.get("required_items", [])]
        score = 0
        for req in required:
            for term in detected_terms:
                if term and (term in req or req in term):
                    score += 1
        if score > 0:
            scored.append((score, project))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [p for _, p in scored[:max_results]]