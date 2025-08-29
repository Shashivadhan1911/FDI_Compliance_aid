import json
from datetime import datetime

# Mock compliance rules database
compliance_rules = {
    "fdi": {
        "current_rules": {
            "single_brand_retail": 51,
            "multi_brand_retail": 51,
            "e-commerce": 100
        },
        "version": "FDI-2025-07-01",
        "last_updated": datetime.now().isoformat()
    }
}

def update_compliance_rules(regulatory_changes):
    """Update compliance rules based on regulatory changes"""
    fdi_changes = [c for c in regulatory_changes if "fdi" in c.get("tags", [])]
    
    for change in fdi_changes:
        # In a real implementation, this would parse the actual regulation text
        # and update the specific rules that changed
        if "single-brand" in change["title"].lower() and "increase" in change["title"].lower():
            compliance_rules["fdi"]["current_rules"]["single_brand_retail"] = 74
        elif "multi-brand" in change["title"].lower() and "increase" in change["title"].lower():
            compliance_rules["fdi"]["current_rules"]["multi_brand_retail"] = 74
            
    # Update version and timestamp
    compliance_rules["fdi"]["version"] = f"FDI-{datetime.now().strftime('%Y-%m-%d')}"
    compliance_rules["fdi"]["last_updated"] = datetime.now().isoformat()
    
    # In a real system, save to database
    with open('compliance_rules.json', 'w') as f:
        json.dump(compliance_rules, f)
    
    return compliance_rules