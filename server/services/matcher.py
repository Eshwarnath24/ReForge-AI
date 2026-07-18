from db.database import projects_collection


def load_knowledge_base():
    """Now reads from MongoDB instead of the local JSON file."""
    return list(projects_collection.find({}, {"_id": 0}))


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