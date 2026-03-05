
import os

filepath = 'app/[locale]/blog/[slug]/page.tsx'

with open(filepath, 'r') as f:
    lines = f.readlines()

first_occurrence = -1
second_occurrence = -1

target_line = 'export default async function BlogPostPage({ params }: Props) {'

for i, line in enumerate(lines):
    if target_line in line:
        if first_occurrence == -1:
            first_occurrence = i
        else:
            second_occurrence = i
            break

if second_occurrence != -1:
    print(f"Found second occurrence at line {second_occurrence + 1}")
    # Keep lines up to second_occurrence (exclusive, but we might want to keep some empty lines before it? No, just cut it off)
    # The second function starts at second_occurrence.
    # We want to keep everything BEFORE second_occurrence.
    
    # Check if there's a blank line before it that we also want to remove?
    # Line 109 is empty in the previous read.
    
    new_lines = lines[:second_occurrence]
    
    # Write back
    with open(filepath, 'w') as f:
        f.writelines(new_lines)
    print("File truncated.")
else:
    print("Second occurrence not found.")
