// Map Pins Configuration
// Coordinates are percentages (0-100) relative to the image
// x: horizontal position (0 = left, 100 = right)
// y: vertical position (0 = top, 100 = bottom)

const MAP_PINS = [
  {
    id: 1,
    country: "United States",
    year: 2024,
    x: 20,
    y: 35,
    delay: 0,
  },
  {
    id: 2,
    country: "United Kingdom",
    year: 2023,
    x: 48,
    y: 28,
    delay: 0.2,
  },
  {
    id: 3,
    country: "France",
    year: 2023,
    x: 49,
    y: 32,
    delay: 0.4,
  },
  {
    id: 4,
    country: "Japan",
    year: 2022,
    x: 82,
    y: 38,
    delay: 0.6,
  },
  {
    id: 5,
    country: "Australia",
    year: 2021,
    x: 80,
    y: 75,
    delay: 0.8,
  },
  // Add more pins here - just specify country, x, y coordinates, year, and delay
  // Example:
  // {
  //   id: 6,
  //   country: "Brazil",
  //   year: 2020,
  //   x: 35,
  //   y: 68,
  //   delay: 1.0,
  // },
];

// Pin styling options (can be customized)
const PIN_CONFIG = {
  color: "#ff4757",
  size: 24, // base size in pixels
  animationDuration: 0.6, // seconds for drop animation
};
