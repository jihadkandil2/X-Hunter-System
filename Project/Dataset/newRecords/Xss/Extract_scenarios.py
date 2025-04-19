import json
import os

def extract_scenarios_to_file(source_file, target_file="all_scenarios.json"):
    try:
        # Read source data
        with open(source_file, 'r') as f:
            data = json.load(f)
        
        # Extract all scenarios
        scenarios = [entry.get("Lab scenario", "") for entry in data if isinstance(entry, dict)]
        scenarios = [s for s in scenarios if s]  # Remove empty strings

        # Read existing scenarios if file exists
        existing_scenarios = []
        if os.path.exists(target_file):
            try:
                with open(target_file, 'r') as f:
                    existing_scenarios = json.load(f)
                    if not isinstance(existing_scenarios, list):
                        existing_scenarios = []
            except json.JSONDecodeError:
                existing_scenarios = []

        # Combine and remove duplicates
        combined = list(set(existing_scenarios + scenarios))
        
        # Save sorted list
        combined.sort()
        with open(target_file, 'w') as f:
            json.dump(combined, f, indent=2)
        
        print(f"Successfully extracted {len(scenarios)} scenarios. Total unique scenarios: {len(combined)}")

    except Exception as e:
        print(f"Error: {str(e)}")

# Example usage
extract_scenarios_to_file(
    source_file='jihad350.json',
    target_file='all_Xss_scenarios.json'
)