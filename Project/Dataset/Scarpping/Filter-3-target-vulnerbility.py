import json

def filter_vulnerabilities(input_filename, output_filename):
    # Define the vulnerability names we want to include.
    target_vulnerabilities = {
        "SQL injection",
        "Cross-site scripting",
        "Authentication"
    }
    
    # Open and load the input JSON file.
    with open(input_filename, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Filter out only the items that have a target vulnerability.
    filtered_data = [item for item in data if item.get("Vulnerability name") in target_vulnerabilities]
    
    # Write the filtered data to the output JSON file.
    with open(output_filename, "w", encoding="utf-8") as out:
        json.dump(filtered_data, out, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(filtered_data)} entries to {output_filename}")

if __name__ == "__main__":
    filter_vulnerabilities("portswigger_vulnerabilities_Level3.json", "Level3-target-data.json")
