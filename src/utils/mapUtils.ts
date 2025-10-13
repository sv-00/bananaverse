// utils/mapUtils.ts
export const getTaskMarkerIconUrl = (isCompleted: boolean, isPendingNew: boolean, quantity: number = 1): string => {
    const emoji = isCompleted ? '✅' : '📦';
    const size = 60;
    const strokeWidth = 5;

    let backgroundColor;
    if (isPendingNew) {
        backgroundColor = '#4B0082';
    } else if (isCompleted) {
        backgroundColor = '#006400';
    } else {
        backgroundColor = '#990000';
    }

    const qtyRadius = 10;
    const qtyX = size - qtyRadius - 3;
    const qtyY = size - qtyRadius - 5;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - strokeWidth}" fill="${backgroundColor}" stroke="#FFFFFF" stroke-width="${strokeWidth}"/>
      <text x="${size / 2}" y="${size / 2}" font-size="28" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF">${emoji}</text>
      <circle cx="${qtyX}" cy="${qtyY}" r="${qtyRadius}" fill="#FFFFFF" stroke="#3B82F6" stroke-width="2"/>
      <text x="${qtyX}" y="${qtyY}" font-size="14" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="#1E3A8A">${quantity}</text>
    </svg>`;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

export const getLiveLocationIconUrl = (): string => {
    const size = 30;
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="12" fill="#FFFFFF" opacity="0.8" stroke="#3B82F6" stroke-width="2"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="6" fill="#1D4ED8"/>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

export const createMarkerElement = (iconUrl: string, size: number = 60): HTMLDivElement => {
    const element = document.createElement('div');
    element.innerHTML = `
    <div style="
      width: ${size}px; 
      height: ${size}px; 
      background-image: url('${iconUrl}');
      background-size: contain;
      background-repeat: no-repeat;
      cursor: pointer;
    "></div>
  `;
    return element;
};