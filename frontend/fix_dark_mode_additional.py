import os

# Directory to search
src_dir = r'C:\MONEYMONEYMONEYMONEYMONEY\BMC mvp\frontend\src'

# Additional patterns to fix
patterns = [
    # Icon colors - lighten from 400 to 300
    ('text-indigo-400', 'text-indigo-300'),
    # Hover states - increase opacity
    ('hover:bg-indigo-500/10', 'hover:bg-indigo-500/20'),
    ('hover:bg-primary/10', 'hover:bg-primary/20'),
    # Border colors - make more visible
    ('border-slate-700', 'border-slate-600'),
]

files_modified = 0
total_replacements = 0

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            file_path = os.path.join(root, file)
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                file_changes = 0
                
                # Apply all patterns
                for find_pattern, replace_pattern in patterns:
                    if find_pattern in content:
                        count = content.count(find_pattern)
                        content = content.replace(find_pattern, replace_pattern)
                        file_changes += count
                
                # Write back if changes were made
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    files_modified += 1
                    total_replacements += file_changes
                    print(f"✓ {file}: {file_changes} replacements")
            
            except Exception as e:
                print(f"✗ Error processing {file}: {e}")

print(f"\n{'='*50}")
print(f"Summary:")
print(f"Files modified: {files_modified}")
print(f"Total replacements: {total_replacements}")
print(f"{'='*50}")
