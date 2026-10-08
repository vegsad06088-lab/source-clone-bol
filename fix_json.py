#!/usr/bin/env python3
import json
import os

os.chdir(r'C:\Users\iseini\WebstormProjects\source-clone\src\translations')

# Read the sq.json file
with open('sq.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the last closing brace
last_brace = content.rfind('}')

if last_brace > 0:
    # Keep only up to the last closing brace
    fixed_content = content[:last_brace + 1]

    # Write back
    with open('sq.json', 'w', encoding='utf-8') as f:
        f.write(fixed_content)

    print("Fixed JSON file")

    # Verify it's valid JSON
    try:
        json.loads(fixed_content)
        print("JSON is now valid!")
    except json.JSONDecodeError as e:
        print(f"Still invalid: {e}")
else:
    print("Could not find closing brace")

