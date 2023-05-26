function convertToDecimal(coord) {
  const degrees = Math.floor(coord / 100);
  const minutes = coord - (degrees * 100);
  return degrees + minutes / 60;
}

// Example usage
const lng = '07653.4974';
const lat = '4309.6480';

const decimalLng = convertToDecimal(parseFloat(lng));
const decimalLat = convertToDecimal(parseFloat(lat));

console.log(`Longitude in decimal: ${decimalLng}`);
console.log(`Latitude in decimal: ${decimalLat}`);
