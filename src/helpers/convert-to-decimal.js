/*
  Latitude conversion algorithm: lat=dd+mm. mmm/60.
  Longitude conversion algorithm: Ing = dd +mm. mmmm/60.
*/
module.exports = function convertToDecimal(coord) {
  const degrees = Math.floor(coord / 100);
  const minutes = coord - (degrees * 100);
  return degrees + minutes / 60;
};
