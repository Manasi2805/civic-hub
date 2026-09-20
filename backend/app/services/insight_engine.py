def generate_area_insight(area_stats: dict) -> str:
    top_issue = area_stats.get('top_issue', 'unknown')
    open_count = area_stats.get('open', 0)
    resolved_count = area_stats.get('resolved', 0)
    avg_resolution = area_stats.get('avg_resolution_days', 0)
    repeats = area_stats.get('repeat_incidents', 0)
    
    insight = []
    
    if open_count > 0:
        insight.append(f"{top_issue.replace('_', ' ').capitalize()}-related complaints account for most open reports in this area.")
    else:
        insight.append("This area currently has very few open complaints.")
        
    if avg_resolution > 5:
        insight.append(f"The area has a higher average unresolved duration of {avg_resolution:.1f} days.")
    elif resolved_count > 0:
        insight.append(f"Resolution is relatively fast here, averaging {avg_resolution:.1f} days.")
        
    if repeats > 3:
        insight.append("There is a significant number of repeat incidents, indicating potentially systemic issues.")
        
    return " ".join(insight)
