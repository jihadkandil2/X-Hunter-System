from huggingface_hub import snapshot_download
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from datasets import load_dataset
from torch.cuda.amp import autocast #to allow use mixed precision
def preprocess_function(data):
    inputs = data["input"]
    targets = data["output"]

    # Add special tokens to inputs
    inputs = [f"<s>{text}</s>" for text in inputs]  
    
    # Tokenize inputs
    model_inputs = tokenizer(
        inputs,
        max_length=512,
        truncation=True, 
        padding="max_length",
        add_special_tokens=True  # Ensures </s> is added
    )
    
    # Tokenize targets (for sequence-to-sequence tasks, use as_target_tokenizer if available)
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(
            targets,
            max_length=512, 
            truncation=True,
             add_special_tokens=True
        )
    
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs


def correct_typos(example):
    typo_map = {
        # Add other typos you find here in format: "typo": "correction"
        "Autnentication": "Authentication",
        "Autnentication": "Authentication",  # Common repeated typo
        "Authetication": "Authentication",
        "Authnetication": "Authentication"
    }
    
    for typo, correction in typo_map.items():
        example["input"] = example["input"].replace(typo, correction)
        example["output"] = example["output"].replace(typo, correction)
    return example
# Set your token
hf_token = "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"  #to authnticate my self when using the Gated reposotories for that model 

# Optionally, set the token as an environment variable
import os
os.environ["HF_HUB_TOKEN"] = hf_token

# Download the model snapshot with the token ,only downloads the files to a local directory:-
#------------------------------------------------------------------------------------------
#[1]- specify path in which the Model's files will be downloaded 
#[2]- we get the reposotories on hugging face which we will find the model 
#[3]- specify which files needed to be downloaded to ignore downloading unnecessary one [configuration/parameters , model's weights , tokenizer]
#[4]- save files in our local folder we specified 
#[5]- specify out tokens to authenticate access that model (does not need this )
mistral_models_path = "./mistral-7b-v0.3"    
snapshot_download(
    repo_id="mistralai/Mistral-7B-v0.3",
    allow_patterns=["params.json", "consolidated.safetensors", "tokenizer.model.v3"],
    local_dir=mistral_models_path,
)

# Load the tokenizer with token /and the model :-
#-----------------------------------------------
#[1]- identify model repo on hugging face in a variable 
#[2]- get the appropriate tokenizer using function from hugging face transformer to automatic detect the most suitable one giving it the 
#     parameter it will need (repo , load the  standard (Python-based) version which is more stable from fast one)
#[3]- downloads the model's architecture and weights from the Hugging Face Hub for fine-tuning
#[4]- specify some parameters (models repo ,  )
model_name = "mistralai/Mistral-7B-v0.3"
tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    trust_remote_code=True,     # execute some code in the repo for input or output processing
    device_map="auto",          # optimize performance by leveraging GPU acceleration
    torch_dtype=torch.float16,  # two types of load weights (float16 [half percision],float[full precesion]) we reduces memory usage and speed up computations
    # token=hf_token  # Pass the token here
)


model.gradient_checkpointing_enable()  # Reduces VRAM usage by ~30-40%

# Create a text-generation pipeline:- (handles the entire process—from tokenizing your input, generating output tokens,decoding those tokens into readable text)
#-----------------------------------------------------------------------------------------------------------------------------------------------------------------
# generator = pipeline("text-generation", model=model, tokenizer=tokenizer)
# prompt = "Generate a cybersecurity lab scenario for SQL injection vulnerability, including lab setup and solution."
# #(,maximum number of tokens for the generated text, enable sampling to allow model to be creative , nucleus sampling ,Controls randomness: lower values make the output more deterministic, while higher values add more variability)
# output = generator(prompt, max_length=250, do_sample=True, top_p=0.95, temperature=0.7)
# print(output[0]['generated_text'])
#[1] Load your fine-tuning dataset 
dataset = load_dataset("json", data_files="/kaggle/input/fine tuning data 1/finetuning_data.jsonl", split="train")
dataset = dataset.map(correct_typos)  # to correct some wrong formats in my data 

# Print first 5 samples to verify that the corrextion happen
for i in range(5):
    print(dataset[i]["output"])
#[2] Split the dataset into training and validation subsets (for example, 90% train and 10% validation)
split_dataset = dataset.train_test_split(test_size=0.1, seed=42)
train_dataset = split_dataset["train"]
validation_dataset = split_dataset["test"]
#[3] Preprocess the training dataset(i am taking a batch of the dataset at a time and apply on it the preprocess funct which tokenize data )
tokenized_train = train_dataset.map(preprocess_function, batched=True)

#[3] Preprocess the validation dataset to evaluate during training
tokenized_validation = validation_dataset.map(preprocess_function, batched=True)
#[4]set up the training arguments:
training_args = TrainingArguments(
    output_dir="/kaggle/working/fine_tuned_model",
    num_train_epochs=3,
    per_device_train_batch_size=2, 
    gradient_accumulation_steps=4 , # Combines 4 batches of size 2 → effective batch size=8
    optim="adamw_torch" ,           # optimizer algorithm for model learning 
    save_steps=500,
    logging_steps=100,
    evaluation_strategy="epoch",    # Evaluate at the end of each epoch
    fp16=True,                      # Enable enables automatic mixed precision
    learning_rate=5e-5,
    gradient_checkpointing=True    #  this to save VRAM
)
#[5] create trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_validation 
)
# Monitor Memory Usage:[allow me to take desicion about batch sizes to try]
print(torch.cuda.memory_summary())

# Start training:
trainer.train()

# Save the fine-tuned model
trainer.save_model("/kaggle/working/fine_tuned_model")
