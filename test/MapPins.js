// Map Pins Configuration
// Coordinates are percentages (0-100) relative to the image
// x: horizontal position (0 = left, 100 = right)
// y: vertical position (0 = top, 100 = bottom)

const MAP_PINS = [
  {
    id: 1,
    country: "Seattle",
    year: 2026,
    x: 18,
    y: 55,
    delay: 0,
    shape: "star", // "star" or "heart"
  },
  {
    id: 2,
    country: "Toronto",
    year: 2022,
    x: 30,
    y: 55,
    delay: 0.2,
    shape: "heart",
  },
  {
    id: 3,
    country: "Europe",
    year: 2026,
    x: 52,
    y: 45,
    delay: 0.4,
    shape: "star",
  },
  {
    id: 4,
    country: "India",
    year: 2024,
    x: 68,
    y: 75,
    delay: 0.6,
    shape: "heart",
  },
  {
    id: 5,
    country: "China",
    year: 2018,
    x: 80,
    y: 55,
    delay: 0.8,
    shape: "star",
  },
  // Add more pins here - just specify country, x, y coordinates, year, delay, and shape
  // Example:
  // {
  //   id: 6,
  //   country: "Brazil",
  //   year: 2020,
  //   x: 35,
  //   y: 68,
  //   delay: 1.0,
  //   shape: "heart",
  // },
];

// Pin styling options (can be customized)
const PIN_CONFIG = {
  color: "#ff4757",
  size: 24, // base size in pixels
  animationDuration: 0.6, // seconds for drop animation
};
