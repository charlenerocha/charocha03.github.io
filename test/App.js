const { useState, useEffect, useRef } = React;

// Action handlers for shelf items
const ITEM_ACTIONS = {
  openLink: (url) => {
    window.open(url, "_blank");
  },
  openGumballGame: () => {
    // Handled by component state
    return "gumballGame";
  },
  // Add more action handlers here as needed for popups, modals, etc.
};

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
    name: "Pictures",
    width: 1.0,
    image: "assets/mirror/frame.png",
  },
  {
    id: 2,
    name: "Golden Pothos",
    width: 1.0,
    image: "assets/plants/golden-pothos.png",
  },
  {
    id: 4,
    name: "Map",
    width: 2,
    image: "assets/random/map.jpg",
    verticalAlign: 20,
  },
  // {
  //   id: 5,
  //   name: "Succulent",
  //   width: 0.8,
  //   image: "assets/plants/succulent.png",
  // },
  // {
  //   id: 6,
  //   name: "Lcd Monitor",
  //   width: 2.0,
  //   image: "assets/random/lcd.png",
  // },
  {
    id: 3,
    name: "Aloe Vera",
    width: 0.9,
    image: "assets/plants/aloe-vera.png",
  },
  {
    id: 7,
    name: "Lamp",
    width: 0.9,
    image: "assets/lighting/lamp3.png",
  },

  {
    id: 9,
    name: "instagram",
    width: 0.4,
    image: "assets/social/instagram.png",
    verticalAlign: 20,
    action: {
      type: "openLink",
      url: "https://www.instagram.com/charlenerocha_/",
    },
  },
  {
    id: 10,
    name: "linkedin",
    width: 0.4,
    image: "assets/social/linkedin.png",
    verticalAlign: 30,
    action: {
      type: "openLink",
      url: "https://www.linkedin.com/in/charlenerochaa/",
    },
  },
  {
    id: 11,
    name: "website",
    width: 0.4,
    image: "assets/social/internet.png",
    action: {
      type: "openLink",
      url: "https://www.charlenerocha.com",
    },
    verticalAlign: 20,
  },
  {
    id: 8,
    name: "Gumball",
    width: 0.8,
    image: "assets/gumball/gumball.png",
    action: {
      type: "openGumballGame",
    },
  },
  {
    id: 12,
    name: "music",
    width: 0.8,
    image: "assets/music/boombox.png",
  },
];

// MapWithPins Component
function MapWithPins({ item, width, height }) {
  const imageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [activePin, setActivePin] = useState(null);

  useEffect(() => {
    const updateImageDimensions = () => {
      if (imageRef.current) {
        setImageDimensions({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight,
        });
      }
    };

    // Update on image load
    if (imageRef.current) {
      imageRef.current.addEventListener("load", updateImageDimensions);
    }

    // Update on resize
    window.addEventListener("resize", updateImageDimensions);

    // Initial update
    updateImageDimensions();

    // Click outside to close tooltip
    const handleClickOutside = (e) => {
      if (!e.target.closest(".map-pin")) {
        setActivePin(null);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updateImageDimensions);
      document.removeEventListener("click", handleClickOutside);
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", updateImageDimensions);
      }
    };
  }, []);

  const handlePinClick = (e, pinId) => {
    e.stopPropagation();
    setActivePin(activePin === pinId ? null : pinId);
  };

  // Check if MAP_PINS is defined (from MapPins.js)
  const pins = typeof MAP_PINS !== "undefined" ? MAP_PINS : [];

  return (
    <div
      className="shelf-item map-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      }}
    >
      <div className="item-image-container">
        <img
          ref={imageRef}
          src={item.image}
          alt={item.name}
          className="item-image map-image"
        />
        {imageDimensions.width > 0 && (
          <div
            className="pins-overlay"
            style={{
              width: `${imageDimensions.width}px`,
              height: `${imageDimensions.height}px`,
            }}
          >
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="map-pin"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  animationDelay: `${pin.delay}s`,
                }}
                onClick={(e) => handlePinClick(e, pin.id)}
              >
                <div className={`pin-head pin-${pin.shape || "star"}`}></div>
                <div className="pin-point"></div>
                {activePin === pin.id && (
                  <div className="pin-tooltip">
                    <div className="tooltip-country">{pin.country}</div>
                    <div className="tooltip-year">{pin.year}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// GumballGame Component
function GumballGame({ onClose }) {
  const [gameState, setGameState] = useState("initial"); // 'initial', 'thinking', 'result'
  const [selectedSticker, setSelectedSticker] = useState(null);

  const STICKERS = [
    "assets/gumball/stickers/candy (1).png",
    "assets/gumball/stickers/candy.png",
    "assets/gumball/stickers/chocolate.png",
    "assets/gumball/stickers/cookies.png",
    "assets/gumball/stickers/cotton-candy.png",
    "assets/gumball/stickers/cup-cake.png",
    "assets/gumball/stickers/gummy-bear.png",
    "assets/gumball/stickers/gummy.png",
    "assets/gumball/stickers/jelly-beans.png",
    "assets/gumball/stickers/lollipop (1).png",
    "assets/gumball/stickers/lollipop (2).png",
    "assets/gumball/stickers/lollipop.png",
    "assets/gumball/stickers/macarons.png",
  ];

  const handleGetGumball = () => {
    setGameState("thinking");

    // Show thinking animation for 2 seconds
    setTimeout(() => {
      const randomSticker =
        STICKERS[Math.floor(Math.random() * STICKERS.length)];
      setSelectedSticker(randomSticker);
      setGameState("result");
    }, 2000);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("gumball-overlay")) {
      onClose();
    }
  };

  return (
    <div className="gumball-overlay" onClick={handleOverlayClick}>
      <div className="gumball-popup">
        {gameState === "initial" && (
          <>
            {/* <h2 className="gumball-title">Get Your Gumball!</h2> */}
            <p className="gumball-description">
              Click the button below to get a candy!
            </p>
            <button className="gumball-button" onClick={handleGetGumball}>
              Get your treat!
            </button>
          </>
        )}

        {gameState === "thinking" && (
          <div className="gumball-thinking">
            <div className="thinking-spinner"></div>
            <p className="thinking-text">Picking your gumball...</p>
          </div>
        )}

        {gameState === "result" && (
          <>
            <h2 className="gumball-title">Here's Your Candy!</h2>
            <div className="gumball-result">
              <img
                src={selectedSticker}
                alt="Your gumball"
                className="gumball-sticker"
              />
            </div>
            <button
              className="gumball-button"
              onClick={() => setGameState("initial")}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ShelfItem Component
function ShelfItem({ item, width, height }) {
  const [showGumballGame, setShowGumballGame] = useState(false);

  const handleItemClick = () => {
    if (item.action) {
      const { type, url } = item.action;
      const actionHandler = ITEM_ACTIONS[type];
      if (actionHandler) {
        const result = actionHandler(url);
        if (result === "gumballGame") {
          console.log("Opening gumball game!");
          setShowGumballGame(true);
        }
      }
    }
  };

  // Check if this is the map item
  if (item.id === 4) {
    return <MapWithPins item={item} width={width} height={height} />;
  }

  return (
    <>
      <div
        className="shelf-item"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: item.action ? "pointer" : "default",
          "--vertical-align": `${item.verticalAlign ?? 100}%`,
        }}
        onClick={handleItemClick}
      >
        {item.action && <div className="interactive"></div>}
        {item.image ? (
          <div className="item-image-container">
            <img
              src={item.image}
              alt={item.name}
              className={`item-image ${item.action ? "interactive" : ""}`}
            />
          </div>
        ) : (
          <div className="item-placeholder">
            <span className="placeholder-icon">📦</span>
          </div>
        )}
      </div>
      {showGumballGame && (
        <GumballGame onClose={() => setShowGumballGame(false)} />
      )}
    </>
  );
}

// DynamicShelves Component
function DynamicShelves() {
  const containerRef = useRef(null);
  const [shelves, setShelves] = useState([]);
  const [itemSize, setItemSize] = useState(100);
  const [shelfSizes, setShelfSizes] = useState([]);

  const MIN_ITEM_SIZE = 80;
  const MAX_ITEM_SIZE = 150;
  const ITEM_GAP = 5;
  const SHELF_VERTICAL_GAP = 30;

  const calculateLayout = () => {
    console.log("Calculating layout1...");
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const totalItems = ITEMS.length;

    // Calculate total width units for all items
    const totalWidthUnits = ITEMS.reduce((sum, item) => sum + item.width, 0);
    const newShelves = [];
    const newShelfSizes = [];
    let startingItemIndex = 0;
    let bestSize = MIN_ITEM_SIZE;

    while (startingItemIndex < totalItems) {
      const numRemainingItems = totalItems - startingItemIndex;

      // Try different numbers of items per shelf to find the best fit
      let bestLayout = null;

      for (
        let itemsPerShelf = 1;
        itemsPerShelf <= numRemainingItems;
        itemsPerShelf++
      ) {
        // Get items for this shelf config and calculate their width units
        const shelfItems = ITEMS.slice(
          startingItemIndex,
          startingItemIndex + itemsPerShelf
        );
        const shelfWidthUnits = shelfItems.reduce(
          (sum, item) => sum + item.width,
          0
        );

        // Calculate the size items would be with this configuration
        const availableWidth = containerWidth - (itemsPerShelf - 1) * ITEM_GAP;
        const calculatedSize = availableWidth / shelfWidthUnits;

        // Check if this size is within our constraints
        if (
          calculatedSize >= MIN_ITEM_SIZE &&
          calculatedSize <= MAX_ITEM_SIZE
        ) {
          if (calculatedSize > bestSize) {
            bestSize = calculatedSize;
            bestLayout = itemsPerShelf;
          }
        }
      }

      // If no valid layout found, use minimum size
      if (!bestLayout) {
        const shelfItems = ITEMS.slice(
          startingItemIndex,
          startingItemIndex + 1
        );
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
      // const newShelves = [];
      // for (let i = 0; i < totalItems; i += bestLayout) {
      const shelfItems = ITEMS.slice(
        startingItemIndex,
        startingItemIndex + bestLayout
      );
      const shelfWidthUnits = shelfItems.reduce((sum, it) => sum + it.width, 0);
      const availableWidth =
        containerWidth - (shelfItems.length - 1) * ITEM_GAP;
      // Constrain to MIN/MAX and keep as float for precise layout
      const shelfSize = Math.max(
        MIN_ITEM_SIZE,
        Math.min(MAX_ITEM_SIZE, availableWidth / shelfWidthUnits)
      );
      newShelves.push(shelfItems);
      newShelfSizes.push(shelfSize);
      startingItemIndex += shelfItems.length;
      // }

      // Compute a size (px) for each shelf so it fills the container width
      // const newShelfSizes = newShelves.map((shelfItems) => {
      //   const shelfWidthUnits = shelfItems.reduce((sum, it) => sum + it.width, 0);
      //   const availableWidth =
      //     containerWidth - (shelfItems.length - 1) * ITEM_GAP;
      //   // Constrain to MIN/MAX and keep as float for precise layout
      //   const size = Math.max(
      //     MIN_ITEM_SIZE,
      //     Math.min(MAX_ITEM_SIZE, availableWidth / shelfWidthUnits)
      //   );
      //   return size;
      // });
    }

    setShelves(newShelves);
    setShelfSizes(newShelfSizes);
    // Keep a global itemSize for fallback/legacy use
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
        <div className="shelves-container" ref={containerRef}>
          {shelves.map((shelfItems, shelfIndex) => (
            <div key={shelfIndex} className="shelf">
              <div className="shelf-board"></div>
              <div className="shelf-items" style={{ gap: `${ITEM_GAP}px` }}>
                {shelfItems.map((item) => (
                  <ShelfItem
                    key={item.id}
                    item={item}
                    width={(shelfSizes[shelfIndex] || itemSize) * item.width}
                    height={shelfSizes[shelfIndex] || itemSize}
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
