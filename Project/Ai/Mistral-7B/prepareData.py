import json

# Load labs from file
with open('input-file.json', 'r', encoding='utf-8') as file:
    labs = json.load(file)

#Depug: to see loaded lab successfully
# Preview a few labs
for lab in labs[:2]:
    print(json.dumps(lab, indent=2))
