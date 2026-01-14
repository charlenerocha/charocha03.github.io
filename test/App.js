const { useState, useEffect, useRef } = React;

// Mirror faces path and styles
const MIRROR_FACES_PATH = "assets/mirror/faces/";
// inject minimal styles for mirror face animation once
(function injectMirrorStyles() {
  try {
    if (document.getElementById("mirror-face-styles")) return;
    const css = `
      .mirror-face-container{position:absolute;left:50%;transform:translateX(-50%);bottom:0;pointer-events:none;z-index:2000;}
      .mirror-face{width:56px;max-width:120px;border-radius:8px;opacity:0;transform:translateY(40px) scale(0.98);transition:transform 360ms cubic-bezier(.2,.9,.2,1),opacity 360ms ease;}
      .mirror-face.show{opacity:1;transform:translateY(0) scale(1);}
      .mirror-face.hide{opacity:0;transform:translateY(-12px) scale(0.96);transition:transform 360ms ease,opacity 260ms ease;}
    `;
    const s = document.createElement("style");
    s.id = "mirror-face-styles";
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  } catch (e) {
    // ignore in non-browser env
  }
})();

// AlbumFan Component: handles loading album manifest and animating albums out from boombox
function AlbumFan() {
  const [albums, setAlbums] = useState([]);
  const [open, setOpen] = useState(false);
  const [offsets, setOffsets] = useState([]);
  const [boomRect, setBoomRect] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Try to load a manifest listing album filenames from test path first, then fallback
    const tryFetch = async () => {
      try {
        const r1 = await fetch("test/assets/music/albums/albums.json");
        if (r1.ok) {
          const list = await r1.json();
          setAlbums(list || []);
          return;
        }
      } catch (e) {}
      try {
        const r2 = await fetch("assets/music/albums/albums.json");
        if (r2.ok) {
          const list = await r2.json();
          setAlbums(list || []);
          return;
        }
      } catch (e) {}
      // As a last resort, attempt to infer a few common filenames (graceful fallback)
      setAlbums([]);
    };
    tryFetch();
  }, []);

  useEffect(() => {
    let boomboxImg = null;

    function updateRect() {
      boomboxImg = document.querySelector('img[src$="boombox.png"]');
      if (!boomboxImg) return;
      const rect = boomboxImg.getBoundingClientRect();
      setBoomRect(rect);
      computeOffsets(rect, albums.length);
    }

    function handleBoomboxClick(e) {
      e.stopPropagation();
      updateRect();
      setOpen((v) => !v);
    }

    function handleDocClick(e) {
      const isBoombox =
        e.target.closest && e.target.closest('img[src$="boombox.png"]');
      const insideFan = e.target.closest && e.target.closest(".album-fan");
      if (!isBoombox && !insideFan) setOpen(false);
    }

    function handleToggleEvent() {
      updateRect();
      setOpen((v) => !v);
    }

    updateRect();
    boomboxImg = document.querySelector('img[src$="boombox.png"]');
    if (boomboxImg) {
      boomboxImg.style.cursor = "pointer";
      boomboxImg.addEventListener("click", handleBoomboxClick);
    }
    document.addEventListener("toggleAlbumFan", handleToggleEvent);
    window.addEventListener("resize", updateRect);
    document.addEventListener("click", handleDocClick);

    return () => {
      if (boomboxImg)
        boomboxImg.removeEventListener("click", handleBoomboxClick);
      document.removeEventListener("toggleAlbumFan", handleToggleEvent);
      window.removeEventListener("resize", updateRect);
      document.removeEventListener("click", handleDocClick);
    };
  }, [albums.length]);

  function computeOffsets(rect, count) {
    if (!rect || count === 0) return setOffsets([]);
    // radius based on viewport and boombox size (halved baseline)
    const vw = Math.min(window.innerWidth, window.innerHeight);
    const base = Math.max(100, Math.min(220, Math.floor(vw / 6)));
    const baseRadius = Math.max(base, rect.width * 1.6) * 0.5;

    // User requested: widen left/right (double) and increase top reach by 1.5
    const radiusX = baseRadius * 2.0; // horizontal multiplier
    const radiusY = baseRadius * 1.5; // vertical multiplier

    // Apply additional multiplier on all sides; slightly larger than previous
    const finalRadiusX = radiusX * 0.75;
    const finalRadiusY = radiusY * 0.75;

    // Narrow the spread to the top-center cluster (approx 11:00 - 1:00)
    // angles: from -120deg (-2/3 PI) to -60deg (-1/3 PI)
    const startAngle = -(2 / 3) * Math.PI; // ~11:00
    const endAngle = -(1 / 3) * Math.PI; // ~1:00

    // small downward shift to lower the whole cluster slightly
    const verticalShift = Math.max(12, Math.floor(baseRadius * 0.15));

    let arr;
    if (count === 1) {
      const angle = -Math.PI / 2; // center top
      const dx = Math.cos(angle) * finalRadiusX;
      const dy = Math.sin(angle) * finalRadiusY + verticalShift;
      arr = [{ dx, dy, rotate: 0 }];
    } else {
      const maxRotate = 12; // degrees, left negative, right positive
      arr = new Array(count).fill(0).map((_, i) => {
        const t = i / (count - 1); // normalized 0..1
        const angle = startAngle + t * (endAngle - startAngle);
        const dx = Math.cos(angle) * finalRadiusX;
        const dy = Math.sin(angle) * finalRadiusY + verticalShift;
        const rotate = (t - 0.5) * (maxRotate * 2);
        return { dx, dy, rotate };
      });
    }
    setOffsets(arr);
  }

  if (!albums || albums.length === 0) return null;

  // center point where album items originate
  const originLeft = boomRect
    ? boomRect.left + boomRect.width / 2
    : window.innerWidth / 2;
  const originTop = boomRect
    ? boomRect.top + boomRect.height / 2
    : window.innerHeight / 2;
  // make album thumbnails smaller
  const thumbSize = boomRect
    ? Math.max(36, Math.min(80, Math.floor(boomRect.width * 0.5)))
    : 48;

  return (
    <div
      ref={containerRef}
      className="album-fan"
      onClick={(e) => {
        // If click is on an album item or the boombox image, ignore.
        if (e.target.closest && e.target.closest(".album-fan-item")) return;
        if (e.target.closest && e.target.closest('img[src$="boombox.png"]'))
          return;
        setOpen(false);
      }}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: open ? "auto" : "none",
        zIndex: 100000,
      }}
    >
      {albums.map((filename, i) => {
        const offset = offsets[i] || { dx: 0, dy: 0, rotate: 0 };
        const initialLeft = originLeft - thumbSize / 2;
        const initialTop = originTop - thumbSize / 2;
        const style = {
          position: "absolute",
          width: `${thumbSize}px`,
          height: `${thumbSize}px`,
          left: `${initialLeft}px`,
          top: `${initialTop}px`,
          transform: open
            ? `translate(${offset.dx}px, ${offset.dy}px) rotate(${offset.rotate}deg) scale(1)`
            : "translate(0,0) scale(0.9)",
          opacity: open ? 1 : 0,
        };

        return (
          <img
            key={filename}
            src={`assets/music/albums/${filename}`}
            alt={`album-${i}`}
            className="album-fan-item"
            style={style}
            onClick={(e) => e.stopPropagation()}
          />
        );
      })}
    </div>
  );
}

// Action handlers for shelf items
const ITEM_ACTIONS = {
  openLink: (url) => {
    window.open(url, "_blank");
  },
  openGumballGame: () => {
    // Handled by component state
    return "gumballGame";
  },
  toggleAlbums: () => {
    // dispatch a custom event the AlbumFan listens for
    const ev = new CustomEvent("toggleAlbumFan");
    document.dispatchEvent(ev);
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
    action: { type: "mirror" },
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
    id: 12,
    name: "music",
    width: 0.8,
    image: "assets/music/boombox.png",
    action: { type: "toggleAlbums" },
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
    id: 8,
    name: "Book",
    width: 0.8,
    image: "assets/random/book.avif",
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
    id: 7,
    name: "Lamp",
    width: 0.9,
    image: "assets/lighting/lamp3.png",
    action: { type: "toggleLamp" },
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
            {/* <button
              className="gumball-button"
              onClick={() => setGameState("initial")}
            >
              Try Again
            </button> */}
          </>
        )}
      </div>
    </div>
  );
}

// ShelfItem Component
function ShelfItem({ item, width, height }) {
  const [showGumballGame, setShowGumballGame] = useState(false);
  const [faceSrc, setFaceSrc] = useState(null);
  const [facePhase, setFacePhase] = useState(""); // "show" | "hide" | ""
  const containerRef = useRef(null);
  const [isLit, setIsLit] = useState(false);

  // manage face show/hide lifecycles
  useEffect(() => {
    if (!faceSrc) return;
    let t1 = setTimeout(() => setFacePhase("show"), 20);
    // hide after 1.4s
    let t2 = setTimeout(() => setFacePhase("hide"), 1400);
    // remove after 1.8s
    let t3 = setTimeout(() => {
      setFaceSrc(null);
      setFacePhase("");
    }, 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [faceSrc]);

  const handleMirrorClick = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    // Only load faces from the test assets directory per project rules
    const tryPaths = [`${MIRROR_FACES_PATH}faces.json`];
    for (const p of tryPaths) {
      try {
        const resp = await fetch(p);
        if (!resp.ok) {
          console.debug("mirror: fetch not ok", p, resp.status);
          continue;
        }
        const list = await resp.json();
        if (!list || list.length === 0) {
          console.debug("mirror: empty list", p);
          continue;
        }
        const name = list[Math.floor(Math.random() * list.length)];
        const base = p.replace(/faces.json$/, "");
        setFaceSrc(base + name);
        console.debug("mirror: using", base + name);
        return;
      } catch (err) {
        console.debug("mirror: fetch failed", p, err);
      }
    }
    // Final fallback to bundled names (works even without JSON)
    const FALLBACK = ["face1.svg", "face2.svg", "face3.svg"];
    const name = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    setFaceSrc(MIRROR_FACES_PATH + name);
  };

  const handleItemClick = (e) => {
    // If this item has a mirror action, show a face
    if (item.action && item.action.type === "mirror") {
      handleMirrorClick(e);
      return;
    }

    // Toggle lamp lit state when lamp action is present
    if (item.action && item.action.type === "toggleLamp") {
      setIsLit((v) => !v);
      return;
    }

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
        ref={containerRef}
      >
        {item.action && <div className="interactive"></div>}
        {item.image ? (
          <div className="item-image-container">
            <img
              src={item.image}
              alt={item.name}
              className={`item-image ${item.action ? "interactive" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(e);
              }}
              style={{
                cursor: item.action ? "pointer" : "default",
                filter: isLit
                  ? "brightness(1.2) drop-shadow(0 0 12px rgba(255, 226, 81, 0.48))"
                  : "none",
                transition: "filter 220ms ease, transform 120ms ease",
              }}
            />
          </div>
        ) : (
          <div className="item-placeholder">
            <span className="placeholder-icon">📦</span>
          </div>
        )}
        {/* mirror face overlay (appears from bottom then disappears) */}
        {faceSrc && (
          <div
            className="mirror-face-container"
            style={{ bottom: `${Math.max(6, Math.round(height * 0.15))}px` }}
          >
            <img
              src={faceSrc}
              alt="face"
              className={`mirror-face ${facePhase}`}
            />
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
        <AlbumFan />
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
