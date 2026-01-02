const { useState, useEffect, useRef } = React;

// Sample items data with varying widths (width is a multiplier of base size)
const ITEMS = [
  {
    id: 1,
    name: "Monstera",
    width: 1.2,
    image: "assets/plants/monstera.png",
  },
  {
    id: 2,
    name: "Golden Pothos",
    width: 1.0,
    image: "assets/plants/golden-pothos.png",
  },
  {
    id: 3,
    name: "Aloe Vera",
    width: 0.9,
    image: "assets/plants/aloe-vera.png",
  },
  {
    id: 4,
    name: "Philodendron",
    width: 5.6,
    image: "assets/map.jpg",
  },
  {
    id: 5,
    name: "Succulent",
    width: 0.8,
    image: "assets/plants/succulent.png",
  },
  {
    id: 6,
    name: "Lcd Monitor",
    width: 2.0,
    image: "assets/lcd.png",
  },
  {
    id: 7,
    name: "Lamp",
    width: 1.5,
    image: "assets/lighting/lamp.png",
  },
  {
    id: 8,
    name: "Gumball",
    width: 1.5,
    image: "assets/gumball.png",
  },
];

// ShelfItem Component
function ShelfItem({ item, width, height }) {
  return (
    <div
      className="shelf-item"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {item.image ? (
        <div className="item-image-container">
          <img src={item.image} alt={item.name} className="item-image" />
        </div>
      ) : (
        <div className="item-placeholder">
          <span className="placeholder-icon">📦</span>
        </div>
      )}
    </div>
  );
}

// DynamicShelves Component
function DynamicShelves() {
  const containerRef = useRef(null);
  const [shelves, setShelves] = useState([]);
  const [itemSize, setItemSize] = useState(100);

  const MIN_ITEM_SIZE = 80;
  const MAX_ITEM_SIZE = 150;
  const ITEM_GAP = 20;
  const SHELF_VERTICAL_GAP = 30;

  const calculateLayout = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const totalItems = ITEMS.length;

    // Calculate total width units for all items
    const totalWidthUnits = ITEMS.reduce((sum, item) => sum + item.width, 0);

    // Try different numbers of items per shelf to find the best fit
    let bestLayout = null;
    let bestSize = MIN_ITEM_SIZE;

    for (let itemsPerShelf = 1; itemsPerShelf <= totalItems; itemsPerShelf++) {
      // Get items for this shelf config and calculate their width units
      const shelfItems = ITEMS.slice(0, itemsPerShelf);
      const shelfWidthUnits = shelfItems.reduce(
        (sum, item) => sum + item.width,
        0
      );

      // Calculate the size items would be with this configuration
      const availableWidth = containerWidth - (itemsPerShelf - 1) * ITEM_GAP;
      const calculatedSize = availableWidth / shelfWidthUnits;

      // Check if this size is within our constraints
      if (calculatedSize >= MIN_ITEM_SIZE && calculatedSize <= MAX_ITEM_SIZE) {
        if (calculatedSize > bestSize) {
          bestSize = calculatedSize;
          bestLayout = itemsPerShelf;
        }
      }
    }

    // If no valid layout found, use minimum size
    if (!bestLayout) {
      const shelfItems = ITEMS.slice(0, 1);
      const shelfWidthUnits = shelfItems.reduce(
        (sum, item) => sum + item.width,
        0
      );
      bestLayout = Math.max(
        1,
        Math.floor(
          containerWidth / (MIN_ITEM_SIZE * shelfWidthUnits + ITEM_GAP)
        )
      );
      bestSize = MIN_ITEM_SIZE;
    }

    // Distribute items across shelves
    const newShelves = [];
    for (let i = 0; i < totalItems; i += bestLayout) {
      newShelves.push(ITEMS.slice(i, i + bestLayout));
    }

    setShelves(newShelves);
    setItemSize(bestSize);
  };

  useEffect(() => {
    calculateLayout();

    const handleResize = () => {
      calculateLayout();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="app-title">Dynamic Shelf Display</h1>
        <div className="shelves-container" ref={containerRef}>
          {shelves.map((shelfItems, shelfIndex) => (
            <div key={shelfIndex} className="shelf">
              <div className="shelf-board"></div>
              <div className="shelf-items" style={{ gap: `${ITEM_GAP}px` }}>
                {shelfItems.map((item) => (
                  <ShelfItem
                    key={item.id}
                    item={item}
                    width={itemSize * item.width}
                    height={itemSize}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<DynamicShelves />);
