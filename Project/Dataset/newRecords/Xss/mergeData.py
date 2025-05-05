import json
import os

def append_batch_to_main(main_filename, batch_filename):
    # Initialize main data as empty list
    main_data = []
    
    # Read existing main file if it exists and is valid
    if os.path.exists(main_filename):
        try:
            with open(main_filename, 'r') as f:
                # Check if file is empty
                if os.path.getsize(main_filename) > 0:
                    main_data = json.load(f)
        except json.JSONDecodeError:
            print(f"Error: {main_filename} contains invalid JSON")
            return
        except Exception as e:
            print(f"Error reading {main_filename}: {str(e)}")
            return

    # Read batch file with error handling
    try:
        with open(batch_filename, 'r') as f:
            batch_data = json.load(f)
    except json.JSONDecodeError:
        print(f"Error: {batch_filename} contains invalid JSON")
        return
    except Exception as e:
        print(f"Error reading {batch_filename}: {str(e)}")
        return

    # Append batch entries to main data
    main_data.extend(batch_data)
    
    # Write updated data back to main file
    try:
        with open(main_filename, 'w') as f:
            json.dump(main_data, f, indent=2)
        print(f"Successfully appended {len(batch_data)} entries from {batch_filename} to {main_filename}")
    except Exception as e:
        print(f"Error writing to {main_filename}: {str(e)}")

# Example usage
append_batch_to_main(
    'D:\\Graduation Project\\X-Hunter-System\\Project\\Dataset\\newRecords\\Xss\\jihad.json',
    'D:\\Graduation Project\\X-Hunter-System\\Project\\Dataset\\newRecords\\Xss\\week 4 (J)\\Jihad-1.json'
)