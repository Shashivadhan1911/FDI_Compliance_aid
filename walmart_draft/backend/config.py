import os

class Config:
    # Government API endpoints (would be real in production)
    GOVERNMENT_API_BASE = os.getenv('GOVERNMENT_API_BASE', 'https://api.example.gov.in/v1')
    FDI_MONITORING_ENDPOINT = f"{GOVERNMENT_API_BASE}/fdi/updates"
    
    # NLP model settings
    NLP_MODEL = "en_core_web_lg"
    
    # Database settings
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///compliance.db')
    
    # Scan frequency in seconds (default: 1 hour)
    SCAN_FREQUENCY = int(os.getenv('SCAN_FREQUENCY', 3600))
    
    # Countries to monitor for FDI changes
    MONITORED_COUNTRIES = os.getenv('MONITORED_COUNTRIES', 'US,IN,CA,MX,UK').split(',')