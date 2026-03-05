import os

filepath = 'app/[locale]/blog/[slug]/page.tsx'

with open(filepath, 'r') as f:
    lines = f.readlines()

first_occurrence = -1
second_occurrence = -1

target_fragment = 'export default async function BlogPostPage'

for i, line in enumerate(lines):
    if target_fragment in line:
        if first_occurrence == -1:
            first_occurrence = i
            print(f"Found first occurrence at line {i + 1}")
        else:
            second_occurrence = i
            print(f"Found second occurrence at line {i + 1}")
            break

if second_occurrence != -1:
    # Keep lines up to second_occurrence (exclusive)
    new_lines = lines[:second_occurrence]
    
    # Write back
    with open(filepath, 'w') as f:
        f.writelines(new_lines)
    print("File truncated.")
else:
    print("Second occurrence not found.")
