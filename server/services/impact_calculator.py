MATERIAL_IMPACT_DATA = {
    "plastic": {"avg_weight_grams": 25, "co2_saved_per_gram": 1.5},
    "glass": {"avg_weight_grams": 400, "co2_saved_per_gram": 0.3},
    "cardboard": {"avg_weight_grams": 50, "co2_saved_per_gram": 0.9},
    "paper": {"avg_weight_grams": 10, "co2_saved_per_gram": 0.9},
    "metal": {"avg_weight_grams": 30, "co2_saved_per_gram": 4.0},
    "fabric": {"avg_weight_grams": 300, "co2_saved_per_gram": 3.6},
    "wood": {"avg_weight_grams": 200, "co2_saved_per_gram": 0.4},
}

DEFAULT_IMPACT = {"avg_weight_grams": 50, "co2_saved_per_gram": 1.0}


def estimate_impact(detected_items: list):
    total_weight_grams = 0
    total_co2_saved_grams = 0

    for item in detected_items:
        material = item.get("material", "").lower().strip()
        impact = MATERIAL_IMPACT_DATA.get(material, DEFAULT_IMPACT)

        weight = impact["avg_weight_grams"]
        co2_saved = weight * impact["co2_saved_per_gram"]

        total_weight_grams += weight
        total_co2_saved_grams += co2_saved

    return {
        "estimated_waste_diverted_grams": round(total_weight_grams, 1),
        "estimated_co2_saved_grams": round(total_co2_saved_grams, 1),
        "note": "Estimates based on average material weights and typical recycling CO2-savings figures. Approximate, for illustrative purposes."
    }