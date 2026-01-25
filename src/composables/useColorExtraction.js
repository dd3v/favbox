import { FastAverageColor } from 'fast-average-color';
import { ref } from 'vue';

export default function useColorExtraction() {
  const placeholder = ref({
    background: 'radial-gradient(ellipse at 50% 40%, rgba(200, 200, 220, 0.5) 0%, rgba(180, 180, 200, 0.3) 50%, rgba(160, 160, 180, 0.15) 100%)',
    transition: 'background 0.8s ease',
  });

  const extract = async (url, cacheKey) => {
    if (!url) return;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const style = JSON.parse(cached);
      placeholder.value = style.placeholder;
      return;
    }
    try {
      const fac = new FastAverageColor();
      const color = await fac.getColorAsync(url);
      const [r, g, b] = color.value;
      const saturate = (v) => Math.min(255, Math.round(v * 1.2));
      const style = {
        placeholder: {
          background: `radial-gradient(ellipse at 50% 40%, rgba(${saturate(r)}, ${saturate(g)}, ${saturate(b)}, 0.5) 0%, rgba(${r}, ${g}, ${b}, 0.3) 50%, rgba(${r}, ${g}, ${b}, 0.15) 100%)`,
          transition: 'background 0.8s ease',
        },
      };
      localStorage.setItem(cacheKey, JSON.stringify(style));
      placeholder.value = style.placeholder;
    } catch (e) {
      console.warn('Color extraction failed, using default', e);
    }
  };

  return { placeholder, extract };
}
