/** Service geography — Porto centre, 100 km radius */
export const serviceArea = {
  center: { lat: 41.1579, lng: -8.6291, name: "Porto" },
  radiusKm: 100,
  radiusMeters: 100_000,
  labelPt: "Porto no centro — raio de 100 km",
  labelEn: "Porto at the centre — 100 km radius",
  shortPt: "Porto e região num raio de 100 km",
  shortEn: "Porto & region within 100 km",
  detailPt:
    "Porto, Grande Porto (Gaia, Matosinhos, Maia, Gondomar, Valongo, Vila do Conde, Póvoa), Braga, Guimarães, Famalicão, Barcelos, Aveiro, Viana do Castelo, Espinho, Feira, Penafiel, Marco de Canaveses e concelhos até 100 km do Porto",
  detailEn:
    "Porto, Greater Porto (Gaia, Matosinhos, Maia, Gondomar, Valongo, Vila do Conde, Póvoa), Braga, Guimarães, Famalicão, Barcelos, Aveiro, Viana do Castelo, Espinho, Feira, Penafiel, Marco de Canaveses and towns within 100 km of Porto",
} as const;
