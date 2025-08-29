import requests
from bs4 import BeautifulSoup
import spacy
from datetime import datetime

# Load NLP model
nlp = spacy.load("en_core_web_lg")

def fetch_government_documents():
    """Mock function to fetch government documents"""
    # In a real implementation, this would call actual government APIs
    mock_documents = [
        {
            "title": "Updated FDI Policy for Retail Sector",
            "source": "Ministry of Commerce",
            "url": "https://example.gov.in/fdi-update-2025",
            "content": "The government has revised FDI limits in the retail sector from 51% to 74% for single-brand retail...",
            "published_date": datetime.now().isoformat(),
            "tags": ["fdi", "retail"]
        },
        # More documents would be fetched here
    ]
    return mock_documents

def process_regulatory_documents():
    """Process regulatory documents using NLP"""
    documents = fetch_government_documents()
    processed_changes = []
    
    for doc in documents:
        # Analyze document with NLP
        doc_text = f"{doc['title']}. {doc['content']}"
        nlp_doc = nlp(doc_text)
        
        # Extract key information
        entities = [(ent.text, ent.label_) for ent in nlp_doc.ents]
        
        # Determine impact (simplified for demo)
        impact = "low"
        if "FDI" in doc_text or "Foreign Direct Investment" in doc_text:
            impact = "high" if "limit" in doc_text or "change" in doc_text else "medium"
        
        # Determine affected areas
        affected_areas = []
        if "retail" in doc_text.lower():
            affected_areas.append("Retail Operations")
        if "e-commerce" in doc_text.lower():
            affected_areas.append("E-commerce")
        
        processed_change = {
            "title": doc["title"],
            "source": doc["source"],
            "url": doc["url"],
            "summary": doc["content"][:200] + "...",
            "published_date": doc["published_date"],
            "impact": impact,
            "affected_areas": affected_areas if affected_areas else ["General"],
            "tags": doc.get("tags", []),
            "entities": entities
        }
        
        processed_changes.append(processed_change)
    
    return processed_changes