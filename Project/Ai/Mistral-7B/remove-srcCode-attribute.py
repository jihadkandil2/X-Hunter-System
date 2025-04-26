import json

# Read the original data
with open('FineTune1.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Remove 'srcCode' and 'Solution Steps' from each entry
filtered_data = [
    {key: value for key, value in entry.items() if key not in ('srcCode', 'Solution Steps','payloads','src code')}
    for entry in data
]

# Write filtered data to a new file
with open('filtered_data.json', 'w', encoding='utf-8') as f:
    json.dump(filtered_data, f, indent=4)
