import json

# Specify file names:
# input_filename: original dataset file (e.g., JSON file containing an array of lab objects)
# output_filename: output file with input-output pairs for fine-tuning (JSONL format)
input_filename = "finetuningSet1.json"  # change this to your original file name
output_filename = "finetuning_data.jsonl"   # the file that will contain the transformed data

# Load the original dataset
with open(input_filename, "r", encoding="utf-8") as f:
    labs_data = json.load(f)

# List to hold the training examples (input-output pairs)
training_examples = []

# Process each lab entry in the original dataset
for lab in labs_data:
    # Extract the four desired attributes, using default empty string if not found
    lab_scenario = lab.get("Lab scenario", "").strip()
    lab_description = lab.get("Lab Description", "").strip()
    vulnerability_name = lab.get("Vulnerability name", "").strip()
    lab_level = lab.get("lab level", "").strip()
    
    # Create the input prompt.
    # For example: "Generate a lab for Authentication:" if vulnerability_name is "Authentication"
    input_prompt = f"Generate a lab for {vulnerability_name}:"
    
    # Create the output string that includes the four attributes.
    # They are formatted line by line.
    output_text = (
        f"Lab scenario: {lab_scenario}\n"
        f"Lab Description: {lab_description}\n"
        f"Vulnerability name: {vulnerability_name}\n"
        f"lab level: {lab_level}"
    )
    
    # Create the training example as a dictionary with keys "input" and "output"
    training_examples.append({
        "input": input_prompt,
        "output": output_text
    })

# Write the training examples to a JSONL file (each line is one JSON object)
with open(output_filename, "w", encoding="utf-8") as f:
    for example in training_examples:
        json_line = json.dumps(example, ensure_ascii=False)
        f.write(json_line + "\n")

print(f"Created {len(training_examples)} training examples in {output_filename}")
