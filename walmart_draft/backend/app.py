from flask import Flask, render_template, jsonify, request
from datetime import datetime, timedelta
import random
from ai_engine.nlp_processor import process_regulatory_documents
from ai_engine.prediction_model import predict_future_regulations
from ai_engine.compliance_updater import update_compliance_rules
import threading
import time

app = Flask(__name__)

# Mock database
compliance_data = {
    "fdi": {
        "status": "Compliant",
        "last_updated": datetime.now().isoformat(),
        "rules_version": "FDI-2025-07-01"
    },
    "alerts_count": 0
}

regulatory_changes = []
predictions = []

def background_scanner():
    """Background task that scans for regulatory changes periodically"""
    while True:
        try:
            # In a real implementation, this would call government APIs
            new_changes = process_regulatory_documents()
            
            # Check for FDI-related changes
            fdi_changes = [c for c in new_changes if "fdi" in c.get("tags", [])]
            if fdi_changes:
                update_compliance_rules(fdi_changes)
                compliance_data["fdi"]["last_updated"] = datetime.now().isoformat()
                compliance_data["fdi"]["rules_version"] = f"FDI-{datetime.now().strftime('%Y-%m-%d')}"
                
                # Generate alerts for significant changes
                significant_changes = [c for c in fdi_changes if c["impact"] in ["high", "medium"]]
                compliance_data["alerts_count"] = len(significant_changes)
            
            regulatory_changes.extend(new_changes)
            # Keep only recent changes
            del regulatory_changes[:-50]
            
            # Update predictions
            new_predictions = predict_future_regulations()
            predictions.clear()
            predictions.extend(new_predictions)
            
        except Exception as e:
            print(f"Error in background scanner: {e}")
        
        # Wait for next scan (in production, this would be configurable)
        time.sleep(3600)  # 1 hour

# API Endpoints
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/compliance-status')
def get_compliance_status():
    return jsonify(compliance_data)

@app.route('/api/regulatory-changes')
def get_regulatory_changes():
    # Return last 10 changes
    return jsonify(regulatory_changes[-10:])

@app.route('/api/predictions')
def get_predictions():
    if predictions:
        return jsonify(predictions[0])
    else:
        return jsonify({
            "title": "No current predictions",
            "description": "The system is currently analyzing regulatory trends.",
            "probability": 0,
            "impact_level": "None",
            "recommended_actions": ["Continue normal operations"]
        })

@app.route('/api/settings', methods=['POST'])
def save_settings():
    data = request.json
    # In a real implementation, save these to a database
    print("Settings saved:", data)
    return jsonify({"status": "success"})

if __name__ == '__main__':
    # Start background scanner in a separate thread
    scanner_thread = threading.Thread(target=background_scanner)
    scanner_thread.daemon = True
    scanner_thread.start()
    
    app.run(debug=True)