
import re
import sys

def fix_mangled_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Define patterns to fix
    replacements = [
        (r'text - \[', 'text-['),
        (r'\] font - ', '] font-'),
        (r'tracking - ', 'tracking-'),
        (r'mb - 3', 'mb-3'),
        (r'px - 1', 'px-1'),
        (r'mt - 0', 'mt-0'),
        (r'mt - 6', 'mt-6'),
        (r'p - 4', 'p-4'),
        (r'pb - 32', 'pb-32'),
        (r'space - y - ', 'space-y-'),
        (r'animate -in', 'animate-in'),
        (r'fade -in', 'fade-in'),
        (r'slide -in', 'slide-in'),
        (r'from - bottom', 'from-bottom'),
        (r'duration - ', 'duration-'),
        (r'text - 2xl', 'text-2xl'),
        (r'text - sm', 'text-sm'),
        (r'text - xs', 'text-xs'),
        (r'text - \[10px\]', 'text-[10px]'),
        (r'\$\{ ', '${'),
        (r' \}', '}'),
        (r'nav_tab_\{ ', 'nav_tab_{'),
        (r' \} ', '} '),
        (r'px - ', 'px-'),
        (r'mb - ', 'mb-'),
        (r'w - ', 'w-'),
        (r'h - ', 'h-'),
        (r'object - contain', 'object-contain'),
        (r'object - cover', 'object-cover'),
        (r'drop - shadow', 'drop-shadow'),
        (r'transition - all', 'transition-all'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    with open(file_path, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    fix_mangled_file(sys.argv[1])
