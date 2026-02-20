const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const iconsDir = 'c:\\SERVIDOR MRI\\txData\\mri_Qbox_975483.base\\resources\\[npwd]\\npwd\\apps\\phone\\src\\os\\apps\\icons';

walkDir(iconsDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes('@mui/material/SvgIcon')) {
            // 1. Remove import
            content = content.replace(/import\s*SvgIcon(?:,\s*\{\s*SvgIconProps\s*\}\s*)?\s*from\s*['"]@mui\/material\/SvgIcon['"];?/g, '');
            content = content.replace(/import\s*\{\s*SvgIconProps\s*\}\s*from\s*['"]@mui\/material\/SvgIcon['"];?/g, '');

            // 2. Replace SvgIconProps with React.SVGProps<SVGSVGElement> (ignoring errors if not perfect)
            content = content.replace(/SvgIconProps/g, 'React.SVGProps<SVGSVGElement> & { htmlColor?: string; }');

            // 3. Replace <SvgIcon {...props}> and <svg with <svg {...props}
            // Since it's multiline, we'll do:
            content = content.replace(/<SvgIcon\s*\{\.\.\.props\}>\s*<svg/g, '<svg {...props}');

            content = content.replace(/<\/SvgIcon>/g, '');

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Replaced SvgIcon in ${filePath}`);
        }
    }
});

console.log('Done!');
