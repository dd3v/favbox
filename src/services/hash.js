export default function hashCode(...str) {
  if (!str.length || !str.every((s) => typeof s === 'string')) {
    return '0';
  }
  const s = str.map((v) => v.trim()).filter((v) => v).join('');
  if (!s) {
    return '0';
  }
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString();
}
