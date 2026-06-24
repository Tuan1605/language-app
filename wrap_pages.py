import os

pages_dir = '/home/adminstrator/code/test/language-app/src/pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.tsx'):
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        if 'AnimatedPage' not in content:
            content = "import { AnimatedPage } from '../components/AnimatedPage';\n" + content
            # Replace className="w-full view-enter" with AnimatedPage wrapping
            # Just wrap the outermost div with <AnimatedPage>
            # The easiest is to find the return statement
            import re
            content = re.sub(r'return \(\s*<LocalErrorBoundary>\s*(<div[^>]*view-enter[^>]*>)\s*([\s\S]*?)\s*</div>\s*</LocalErrorBoundary>', 
                             r'return (\n    <LocalErrorBoundary>\n      <AnimatedPage>\n        \1\n        \2\n        </div>\n      </AnimatedPage>\n    </LocalErrorBoundary>', content)
            
            content = re.sub(r'return \(\s*(<div[^>]*view-enter[^>]*>)\s*([\s\S]*?)\s*</div>\s*\)', 
                             r'return (\n    <AnimatedPage>\n      \1\n      \2\n      </div>\n    </AnimatedPage>\n  )', content)
            
            with open(filepath, 'w') as f:
                f.write(content)
