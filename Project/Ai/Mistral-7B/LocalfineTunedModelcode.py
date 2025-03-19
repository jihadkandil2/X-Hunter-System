# !pip uninstall -y torch torchvision torchaudio transformers tokenizers
# !pip install torch==2.5.1+cu121 --index-url https://download.pytorch.org/whl/cu121 --no-deps
# !pip install tokenizers==0.19.1 --no-deps
# !pip install transformers==4.40.0 --no-deps
# !pip install peft==0.11.0 datasets==2.18.0 evaluate==0.4.1 accelerate==0.29.3


import os
os.environ['CUDA_HOME'] = '/usr/local/cuda'

import torch
from transformers import __version__ as tf_version
from tokenizers import __version__ as tk_version

print("CUDA Available:", torch.cuda.is_available())
print("CUDA Version:", torch.version.cuda)
print("Transformers:", tf_version)  # Should show 4.40.0
print("Tokenizers:", tk_version)    # Should show 0.19.1
from huggingface_hub import snapshot_download
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from datasets import load_dataset
from peft import LoraConfig
from evaluate import load
import re
from collections import Counter


def preprocess_function(data, tokenizer):
    inputs = data["input"]
    targets = data["output"]

    # Add special tokens to inputs
    inputs = [f"<s>[INST] {text} [/INST]" for text in inputs]  
    
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


# [1] Load and clean dataset
dataset = load_dataset("json", data_files="/kaggle/input/fine-tuning-data-1/finetuning_data.jsonl", split="train")

# Clean typos FIRST
dataset = dataset.map(correct_typos)

# [2] Shuffle with seed + split
split_dataset = dataset.train_test_split(
    test_size=0.1,
    shuffle=True,  # Explicitly enable shuffling
    seed=42        # Fixed seed for reproducibility
)

# [3] Get splits
train_dataset = split_dataset["train"]
validation_dataset = split_dataset["test"]

# [4] Verify correction in BOTH splits
print("=== Training Set Samples ===")
for i in range(2):
    print(train_dataset[i]["output"])
    print("-------------------------")

print("\n=== Validation Set Samples ===")    
for i in range(2):
    print(validation_dataset[i]["output"])
    print("-------------------------")


# Set your token
hf_token = "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"  #to authnticate my self when using the Gated reposotories for that model 

# Optionally, set the token as an environment variable
os.environ["HF_HUB_TOKEN"] = hf_token

# Download the model snapshot with the token ,only downloads the files to a local directory:-
#------------------------------------------------------------------------------------------
#[1]- specify path in which the Model's files will be downloaded 
#[2]- we get the reposotories on hugging face which we will find the model 
#[3]- specify which files needed to be downloaded to ignore downloading unnecessary one [configuration/parameters , model's weights , tokenizer]
#[4]- save files in our local folder we specified 
#[5]- specify out tokens to authenticate access that model (does not need this )
mistral_models_path = "./Mistral-7B-Instruct-v0.2"    
snapshot_download(
    repo_id="mistralai/Mistral-7B-Instruct-v0.2",
    allow_patterns=["params.json", "consolidated.safetensors", "tokenizer.model.v3"],
    local_dir=mistral_models_path,
)        