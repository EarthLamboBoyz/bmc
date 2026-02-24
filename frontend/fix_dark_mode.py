import os
import re

# Directory to search
src_dir = r'C:\MONEYMONEYMONEYMONEYMONEY\BMC mvp\frontend\src'

# Pattern to find and replace
find_pattern = r'text-gray-500 dark:text-gray-400'
replace_pattern = r'text-gray-500 dark:text-gray-300'

# Counter
files_modified = 0
total_replacements = 0

# Walk through all .tsx files
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            file_path = os.path.join(root, file)
            
            try:
                # Read file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check if pattern exists
                if find_pattern in content:
                    # Count replacements
                    count = content.count(find_pattern)
                    
                    # Replace
                    new_content = content.replace(find_pattern, replace_pattern)
                    
                    # Write back
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    files_modified += 1
                    total_replacements += count
                    print(f"✓ {file}: {count} replacements")
            
            except Exception as e:
                print(f"✗ Error processing {file}: {e}")

print(f"\n{'='*50}")
print(f"Summary:")
print(f"Files modified: {files_modified}")
print(f"Total replacements: {total_replacements}")
print(f"{'='*50}")
