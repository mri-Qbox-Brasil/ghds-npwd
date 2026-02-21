/**
 * Utility to determine if a color or image area is light or dark.
 */

export const getBrightnessFromColor = (color: string): 'light' | 'dark' => {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return 'dark';

    let r, g, b;

    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith('rgb')) {
        const rgb = color.match(/\d+/g);
        if (!rgb) return 'dark';
        r = parseInt(rgb[0]);
        g = parseInt(rgb[1]);
        b = parseInt(rgb[2]);
    } else {
        return 'dark';
    }

    // YIQ formula
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'dark' : 'light';
};

export const getBrightnessFromImage = (imageUrl: string): Promise<'light' | 'dark'> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve('light');
                return;
            }

            const sampleHeight = Math.min(img.height, 50); // Sample top 50px
            canvas.width = img.width;
            canvas.height = sampleHeight;

            ctx.drawImage(img, 0, 0, img.width, sampleHeight, 0, 0, img.width, sampleHeight);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                let r, g, b;
                let colorSum = 0;

                for (let x = 0, len = data.length; x < len; x += 4) {
                    r = data[x];
                    g = data[x + 1];
                    b = data[x + 2];
                    colorSum += (r * 299 + g * 587 + b * 114) / 1000;
                }

                const brightness = colorSum / (canvas.width * canvas.height);
                resolve(brightness >= 128 ? 'dark' : 'light');
            } catch (e) {
                resolve('light');
            }
        };

        img.onerror = () => resolve('light');
    });
};

/**
 * Detects the effective brightness at a specific point on the screen
 * by inspecting the DOM elements behind that point.
 */
export const getAmbientBrightness = async (
    x: number,
    y: number,
    excludeElement?: HTMLElement | null,
    currentWallpaper?: string
): Promise<'light' | 'dark'> => {
    const elements = document.elementsFromPoint(x, y);

    for (const el of elements as HTMLElement[]) {
        // Skip the excluded element (usually the NotificationBar itself)
        if (el === excludeElement || (excludeElement && excludeElement.contains(el))) continue;

        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;
        const bgColor = style.backgroundColor;

        // 1. Check for background images
        if (bgImage && bgImage !== 'none' && bgImage.includes('url')) {
            const urlMatch = bgImage.match(/url\((['"]?)(.*?)\1\)/);
            if (urlMatch) {
                return await getBrightnessFromImage(urlMatch[2]);
            }
        }

        // 2. Check for solid background colors
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            return getBrightnessFromColor(bgColor);
        }
    }

    // 3. Last fallback: Check the provided wallpaper URL
    if (currentWallpaper) {
        const urlMatch = currentWallpaper.match(/url\((['"]?)(.*?)\1\)/);
        if (urlMatch) {
            return await getBrightnessFromImage(urlMatch[2]);
        }
    }

    return 'light'; // Ultimate fallback
};
