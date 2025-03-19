import json

# Read the original data
with open('data.json', 'r') as f:
    data = json.load(f)

# Remove 'srcCode' from each entry
filtered_data = [
    {key: value for key, value in entry.items() if key != 'srcCode'}
    for entry in data
]

# Write filtered data to a new file
with open('filtered_data.json', 'w') as f:
    json.dump(filtered_data, f, indent=4)