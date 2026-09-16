export function parseSpiceLevel(spiceLevel) {
    if (!spiceLevel) return { level: null, label: "" };
const match = spiceLevel.match(/\((\d)\/3\)/);
const level = match ? Number(match[1]) : null;
const label = spiceLevel.replace(/\s*\(\d\/3\)/, "").trim();
return { level, label };
}

const PLACEHOLDER_PALETTE = ["#fceae4", "#f6e5de", "#f0dfd8", "#fdead0"];

export function placeholderColor(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
}
return PLACEHOLDER_PALETTE[hash % PLACEHOLDER_PALETTE.length];
}