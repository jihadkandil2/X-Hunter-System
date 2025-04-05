import json

def count_labs(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        
        # If the root of the JSON is a list of labs
        if isinstance(data, list):
            print(f"Total Labs: {len(data)}")
        else:
            print("JSON format not supported. Expected a list at the top level.")

# Example usage:
count_labs('seham-3 (20).json')  # Replace with your actual file name