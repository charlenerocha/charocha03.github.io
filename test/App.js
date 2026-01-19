const { useState, useEffect, useRef } = React;

// Mirror faces path and styles
const MIRROR_FACES_PATH = "assets/mirror/faces/";
// inject minimal styles for mirror face animation once
(function injectMirrorStyles() {
  try {
    if (document.getElementById("mirror-face-styles")) return;
    const css = `
      .mirror-face-container{position:absolute;left:50%;transform:translateX(-50%);bottom:0;pointer-events:none;z-index:2000;}
      /* smaller faces and a tighter entrance so they sit higher visually */
      .mirror-face{width:40px;max-width:88px;border-radius:8px;opacity:0;transform:translateY(28px) scale(0.86);transition:transform 360ms cubic-bezier(.2,.9,.2,1),opacity 320ms ease;}
      .mirror-face.show{opacity:1;transform:translateY(0) scale(1);}
      .mirror-face.hide{opacity:0;transform:translateY(-8px) scale(0.84);transition:transform 320ms ease,opacity 240ms ease;}
    `;
    const s = document.createElement("style");
    s.id = "mirror-face-styles";
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  } catch (e) {
    // ignore in non-browser env
  }
})();

// Action handlers for shelf items
const ITEM_ACTIONS = {
  openLink: (url) => {
    window.open(url, "_blank");
  },
  openGumballGame: () => {
    // Handled by component state
    return "gumballGame";
  },
  openBookRecs: () => {
    // signal to ShelfItem to open book recommendations popup
    return "openBookRecs";
  },
  openMusicRecs: () => {
    // signal to ShelfItem to open music/album recommendations popup
    return "openMusicRecs";
  },
  openFoodGame: () => {
    // signal to ShelfItem to open the food like/dislike drag-and-drop game
    return "openFoodGame";
  },
  openWordleGame: () => {
    // signal to ShelfItem to open the Monstera wordle popup
    return "openWordleGame";
  },
  // Add more action handlers here as needed for popups, modals, etc.
};

// Me, plant, mirror, lamp

// map, books, plant, boombox

// plant, food, gumball, piggy bank

// footer - social media links

// Sample items data with varying widths (width is a multiplier of base size)
const ITEMS = [
  // first row
  {
    id: 0,
    name: "Me",
    width: 0.8,
    image: "assets/plushie/me.png",
    verticalAlign: 115,
  },
  {
    id: 1,
    name: "Monstera",
    width: 0.8,
    image: "assets/plants/monstera.png",
    action: { type: "openWordleGame" },
  },
  {
    id: 2,
    name: "Mirror",
    width: 0.7,
    image: "assets/mirror/frame.png",
    action: { type: "mirror" },
    verticalAlign: 80,
  },
  {
    id: 8,
    name: "Gumball",
    width: 0.5,
    image: "assets/gumball/gumball.png",
    action: {
      type: "openGumballGame",
    },
  },

  // second row
  {
    id: 4,
    name: "Map",
    width: 1.0,
    image: "assets/random/map.jpg",
    verticalAlign: 20,
  },
  {
    id: 14,
    name: "Food",
    width: 0.5,
    image: "assets/food/fruit.png",
    action: { type: "openFoodGame" },
  },
  {
    id: 2,
    name: "Golden Pothos",
    width: 0.7,
    image: "assets/plants/golden-pothos.png",
  },
  {
    id: 12,
    name: "Boombox",
    width: 0.5,
    image: "assets/music/boombox.png",
    action: { type: "openMusicRecs" },
  },

  // third row
  {
    id: 3,
    name: "Aloe Vera",
    width: 0.4,
    image: "assets/plants/aloe-vera.png",
  },
  {
    id: 13,
    name: "Books",
    width: 0.9,
    image: "assets/books/books (1).png",
    action: { type: "openBookRecs" },
  },
  {
    id: 7,
    name: "Lamp",
    width: 0.6,
    image: "assets/lighting/lamp3.png",
    action: { type: "toggleLamp" },
  },
  {
    id: 5,
    name: "Piggy",
    width: 0.5,
    image: "assets/piggy/piggy-bank (2).png",
  },

  // {
  //   id: 5,
  //   name: "Succulent",
  //   width: 0.6,
  //   image: "assets/plants/succulent.png",
  // },
  // {
  //   id: 9,
  //   name: "instagram",
  //   width: 0.4,
  //   image: "assets/social/instagram.png",
  //   verticalAlign: 30,
  //   action: {
  //     type: "openLink",
  //     url: "https://www.instagram.com/charlenerocha_/",
  //   },
  // },
  // {
  //   id: 10,
  //   name: "linkedin",
  //   width: 0.4,
  //   image: "assets/social/linkedin.png",
  //   verticalAlign: 50,
  //   action: {
  //     type: "openLink",
  //     url: "https://www.linkedin.com/in/charlenerochaa/",
  //   },
  // },
  // {
  //   id: 11,
  //   name: "website",
  //   width: 0.4,
  //   image: "assets/social/internet.png",
  //   action: {
  //     type: "openLink",
  //     url: "https://www.charlenerocha.com",
  //   },
  //   verticalAlign: 30,
  // },
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

  useEffect(() => {
    try {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    } catch (e) {
      // ignore when not in browser
    }
  }, []);

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

    // Show thinking animation for 1 second
    setTimeout(() => {
      if (!STICKERS || STICKERS.length === 0) {
        setSelectedSticker(null);
        setGameState("result");
        return;
      }
      // If only one sticker, return it
      if (STICKERS.length === 1) {
        setSelectedSticker(STICKERS[0]);
        setGameState("result");
        return;
      }
      // Pick a random sticker different from the previous one when possible
      const prev = selectedSticker;
      let randomSticker;
      let attempts = 0;
      do {
        randomSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
        attempts++;
      } while (randomSticker === prev && attempts < 10);
      if (randomSticker === prev) {
        // fallback: choose first different sticker deterministically
        randomSticker = STICKERS.find((s) => s !== prev) || randomSticker;
      }
      setSelectedSticker(randomSticker);
      setGameState("result");
    }, 1000);
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
            <div
              className="gumball-result"
              onClick={() => setGameState("initial")}
            >
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

// Wordle-style game shown when Monstera is clicked
function WordleGame({ onClose }) {
  const WORDS = ["shelf", "hello", "tests"];
  const [answer, setAnswer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const MAX_GUESSES = 4;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    startNew();
  }, []);

  const startNew = () => {
    const pick = WORDS[Math.floor(Math.random() * WORDS.length)];
    setAnswer(pick);
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
  };

  /**
   * Correct Wordle evaluation:
   * 1) Mark correct letters first
   * 2) Then mark present letters using remaining counts
   */
  const evaluateGuess = (guess, answer) => {
    const result = Array(guess.length).fill("absent");
    const counts = {};

    // Count letters in answer
    for (const ch of answer) {
      counts[ch] = (counts[ch] || 0) + 1;
    }

    // Pass 1: correct (green)
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        result[i] = "correct";
        counts[guess[i]]--;
      }
    }

    // Pass 2: present (yellow)
    for (let i = 0; i < guess.length; i++) {
      const ch = guess[i];
      if (result[i] === "correct") continue;

      if (counts[ch] > 0) {
        result[i] = "present";
        counts[ch]--;
      }
    }

    return result;
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!current || current.length !== answer.length || status !== "playing")
      return;

    const guess = current.toLowerCase();
    const evaluation = evaluateGuess(guess, answer);
    const next = [...guesses, { guess, evaluation }];

    setGuesses(next);
    setCurrent("");

    if (guess === answer) {
      setStatus("won");
    } else if (next.length >= MAX_GUESSES) {
      setStatus("lost");
    }
  };

  const handleOverlayClick = (e) => {
    if (
      e.target.classList.contains("gumball-overlay") ||
      e.target.classList.contains("wordle-overlay")
    ) {
      onClose();
    }
  };

  return (
    <div
      className="gumball-overlay wordle-overlay"
      onClick={handleOverlayClick}
    >
      <div
        className="gumball-popup"
        style={{ maxWidth: 520, fontFamily: '"Fredoka", sans-serif' }}
      >
        <h2 className="gumball-title">Wordle</h2>
        <p className="gumball-description">
          Guess the {answer ? answer.length : 5}-letter word.
        </p>

        <div
          style={{
            display: "grid",
            gap: 8,
            marginBottom: 12,
            maxWidth: 360,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {Array.from({ length: MAX_GUESSES }).map((_, idx) => {
            const row = guesses[idx] || null;
            const letters = row
              ? row.guess.split("")
              : Array.from({ length: answer ? answer.length : 5 }).map(
                  () => "",
                );

            return (
              <div
                key={idx}
                style={{ display: "flex", gap: 6, justifyContent: "center" }}
              >
                {letters.map((ch, i) => {
                  const cls = row ? row.evaluation[i] : "";
                  const bg =
                    cls === "correct"
                      ? "#4caf50"
                      : cls === "present"
                        ? "#f4c542"
                        : cls === "absent"
                          ? "#ddd"
                          : "#fff";

                  return (
                    <div
                      key={i}
                      style={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: bg,
                        borderRadius: 6,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {status === "playing" && (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              value={current}
              onChange={(e) =>
                setCurrent(
                  e.target.value
                    .toLowerCase()
                    .slice(0, answer ? answer.length : 5),
                )
              }
              placeholder="Type your guess"
              style={{
                padding: "5px 10px",
                fontSize: 16,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: 180,
                maxWidth: "60%",
              }}
            />
            <button className="gumball-button" type="submit">
              Guess
            </button>
          </form>
        )}

        {status === "won" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>You won!</div>
            <button className="gumball-button" onClick={startNew}>
              Play again
            </button>
          </div>
        )}

        {status === "lost" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 8 }}>
              Out of guesses — the answer was <strong>{answer}</strong>.
            </div>
            <button className="gumball-button" onClick={startNew}>
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// BookRecs Component: similar behavior to GumballGame but loads recommendation images
function BookRecs({ onClose }) {
  const [state, setState] = useState("initial"); // 'initial' | 'thinking' | 'result'
  const [selected, setSelected] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    try {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    } catch (e) {}
  }, []);

  useEffect(() => {
    // Load manifest as single source of truth. Manifest must be an array of
    // strings (filenames) or objects { file: "name.ext", note: "reason" }.
    const manifestPath = "assets/books/recommended/recommendations.json";

    (async () => {
      try {
        const r = await fetch(manifestPath);
        if (!r.ok) {
          console.warn(
            "BookRecs: recommendations manifest not found:",
            manifestPath,
          );
          setList([]);
          return;
        }
        const arr = await r.json();
        if (!arr || !arr.length) {
          setList([]);
          return;
        }
        const normalized = arr
          .map((item) => {
            if (typeof item === "string") {
              return { src: `assets/books/recommended/${item}`, note: "" };
            }
            if (item && typeof item === "object") {
              const file = item.file || item.filename || item.name || item.src;
              return {
                src: file ? `assets/books/recommended/${file}` : null,
                note: item.note || item.description || "",
              };
            }
            return null;
          })
          .filter(Boolean);
        setList(normalized);
      } catch (err) {
        console.warn("BookRecs: failed loading manifest", err);
        setList([]);
      }
    })();
  }, []);

  const handleGet = () => {
    setState("thinking");
    setTimeout(() => {
      if (!list || list.length === 0) {
        setSelected(null);
        setState("result");
        return;
      }
      if (list.length === 1) {
        setSelected(list[0]);
        setState("result");
        return;
      }
      // prefer a different recommendation than the previous one
      const prevSrc = selected && selected.src ? selected.src : null;
      let pick;
      let attempts = 0;
      do {
        pick = list[Math.floor(Math.random() * list.length)];
        attempts++;
      } while (prevSrc && pick && pick.src === prevSrc && attempts < 10);
      if (prevSrc && pick && pick.src === prevSrc) {
        pick = list.find((i) => i.src !== prevSrc) || pick;
      }
      setSelected(pick);
      setState("result");
    }, 800);
  };

  const handleOverlayClick = (e) => {
    if (
      e.target.classList.contains("gumball-overlay") ||
      e.target.classList.contains("book-overlay")
    ) {
      onClose();
    }
  };

  return (
    <div className="gumball-overlay book-overlay" onClick={handleOverlayClick}>
      <div className="gumball-popup">
        {state === "initial" && (
          <>
            <p className="gumball-description">
              Click to get a book recommendation!
            </p>
            <button className="gumball-button" onClick={handleGet}>
              Recommend a book
            </button>
          </>
        )}

        {state === "thinking" && (
          <div className="gumball-thinking">
            <div className="thinking-spinner"></div>
            <p className="thinking-text">Picking a recommendation...</p>
          </div>
        )}

        {state === "result" && (
          <>
            <div className="gumball-result" onClick={() => setState("initial")}>
              {selected ? (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={selected.src}
                    alt="recommendation"
                    className="gumball-sticker"
                  />
                  <p className="book-note" style={{ marginTop: 12 }}>
                    {selected.note}
                  </p>
                </div>
              ) : (
                <div style={{ padding: 16 }}>No recommendations available.</div>
              )}
            </div>
            {/* <button
              className="gumball-button"
              onClick={() => setState("initial")}
            >
              Recommend another
            </button> */}
          </>
        )}
      </div>
    </div>
  );
}

// MusicRecs Component: same UI as BookRecs but for albums
function MusicRecs({ onClose }) {
  const [state, setState] = useState("initial"); // 'initial' | 'thinking' | 'result'
  const [selected, setSelected] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    const manifestPath = "assets/music/albums/recommendations.json";

    (async () => {
      try {
        const r = await fetch(manifestPath);
        if (!r.ok) {
          console.warn(
            "MusicRecs: recommendations manifest not found:",
            manifestPath,
          );
          setList([]);
          return;
        }
        const arr = await r.json();
        if (!arr || !arr.length) {
          setList([]);
          return;
        }
        const normalized = arr
          .map((item) => {
            if (typeof item === "string") {
              return { src: `assets/music/albums/${item}`, note: "" };
            }
            if (item && typeof item === "object") {
              const file = item.file || item.filename || item.name || item.src;
              console.log("MusicRecs: loaded item", file);
              return {
                src: file ? `assets/music/albums/${file}` : null,
                note: item.note || item.description || item.artist || "",
              };
            }
            return null;
          })
          .filter(Boolean);
        setList(normalized);
      } catch (err) {
        console.warn("MusicRecs: failed loading manifest", err);
        setList([]);
      }
    })();
  }, []);

  const handleGet = () => {
    setState("thinking");
    setTimeout(() => {
      if (!list || list.length === 0) {
        setSelected(null);
        setState("result");
        return;
      }
      if (list.length === 1) {
        setSelected(list[0]);
        setState("result");
        return;
      }
      // prefer a different album than the previous one
      const prevSrc = selected && selected.src ? selected.src : null;
      let pick;
      let attempts = 0;
      do {
        pick = list[Math.floor(Math.random() * list.length)];
        attempts++;
      } while (prevSrc && pick && pick.src === prevSrc && attempts < 10);
      if (prevSrc && pick && pick.src === prevSrc) {
        pick = list.find((i) => i.src !== prevSrc) || pick;
      }
      setSelected(pick);
      setState("result");
    }, 800);
  };

  const handleOverlayClick = (e) => {
    if (
      e.target.classList.contains("gumball-overlay") ||
      e.target.classList.contains("book-overlay") ||
      e.target.classList.contains("music-overlay")
    ) {
      onClose();
    }
  };

  return (
    <div
      className="gumball-overlay book-overlay music-overlay"
      onClick={handleOverlayClick}
    >
      <div className="gumball-popup">
        {state === "initial" && (
          <>
            <p className="gumball-description">
              Click to get an album recommendation!
            </p>
            <button className="gumball-button" onClick={handleGet}>
              Recommend an album
            </button>
          </>
        )}

        {state === "thinking" && (
          <div className="gumball-thinking">
            <div className="thinking-spinner"></div>
            <p className="thinking-text">Picking a recommendation...</p>
          </div>
        )}

        {state === "result" && (
          <>
            <div className="gumball-result" onClick={() => setState("initial")}>
              {selected ? (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={selected.src}
                    alt="recommendation"
                    className="gumball-sticker"
                  />
                  <p className="book-note" style={{ marginTop: 12 }}>
                    {selected.note}
                  </p>
                </div>
              ) : (
                <div style={{ padding: 16 }}>No recommendations available.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// FoodGame Component: drag-and-drop categorize foods into Like / Dislike
function FoodGame({ onClose }) {
  const [answers, setAnswers] = useState({ likes: [], dislikes: [] });
  const [items, setItems] = useState([]); // filenames
  const [placements, setPlacements] = useState({}); // filename -> 'likes'|'dislikes'
  const [shuffled, setShuffled] = useState([]);

  // Refs for drop zones and drag state for mobile-friendly dragging
  const likesZoneRef = useRef(null);
  const dislikesZoneRef = useRef(null);
  const dragStateRef = useRef({});
  const [dragPreview, setDragPreview] = useState(null); // { file, x, y }
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    try {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    } catch (e) {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("assets/food/tastes/answers.json");
        if (!r.ok) {
          console.warn("FoodGame: answers.json not found");
          setAnswers({ likes: [], dislikes: [] });
          setItems([]);
          return;
        }
        const a = await r.json();
        const like = Array.isArray(a.likes) ? a.likes : [];
        const dislike = Array.isArray(a.dislikes) ? a.dislikes : [];
        const union = Array.from(new Set([...like, ...dislike]));
        setAnswers({ likes: like, dislikes: dislike });
        setItems(union);
        // shuffle for presentation
        const shuffled = union.slice().sort(() => Math.random() - 0.5);
        setShuffled(shuffled);
      } catch (err) {
        console.warn("FoodGame: failed to load answers", err);
        setAnswers({ likes: [], dislikes: [] });
        setItems([]);
      }
    })();
    // detect touch capability once
    try {
      const hasTouch =
        typeof window !== "undefined" &&
        ("ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0);
      setIsTouchDevice(Boolean(hasTouch));
    } catch (e) {}
  }, []);

  const handleOverlayClick = (e) => {
    if (
      e.target.classList.contains("gumball-overlay") ||
      e.target.classList.contains("book-overlay") ||
      e.target.classList.contains("food-overlay")
    ) {
      onClose();
    }
  };

  // Keep HTML5 drag/drop as a fallback for desktop
  const onDragStart = (e, filename) => {
    try {
      e.dataTransfer.setData("text/plain", filename);
    } catch (err) {
      // ignore
    }
  };

  const onDropTo = (e, zone) => {
    e.preventDefault();
    const filename = e.dataTransfer.getData("text/plain");
    if (!filename) return;
    setPlacements((p) => ({ ...p, [filename]: zone }));
  };

  const onDragOver = (e) => e.preventDefault();

  // Pointer/touch drag for mobile
  const startPointerDrag = (ev, filename) => {
    // get initial coords
    const clientX =
      ev.clientX !== undefined
        ? ev.clientX
        : (ev.touches && ev.touches[0] && ev.touches[0].clientX) || 0;
    const clientY =
      ev.clientY !== undefined
        ? ev.clientY
        : (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
    dragStateRef.current = {
      file: filename,
      startX: clientX,
      startY: clientY,
      dragging: false,
    };

    const move = (e) => {
      const cx =
        e.clientX !== undefined
          ? e.clientX
          : (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
      const cy =
        e.clientY !== undefined
          ? e.clientY
          : (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
      const st = dragStateRef.current;
      if (!st) return;
      const dx = Math.abs(cx - st.startX);
      const dy = Math.abs(cy - st.startY);
      // small threshold to avoid treating taps as drags
      if (!st.dragging && Math.sqrt(dx * dx + dy * dy) > 12) {
        st.dragging = true;
        setDragPreview({ file: filename, x: cx, y: cy });
      }
      if (st.dragging) {
        setDragPreview({ file: filename, x: cx, y: cy });
        e.preventDefault && e.preventDefault();
      }
    };

    const up = (e) => {
      const st = dragStateRef.current;
      if (!st) return cleanup();
      const cx =
        e.clientX !== undefined
          ? e.clientX
          : (e.changedTouches &&
              e.changedTouches[0] &&
              e.changedTouches[0].clientX) ||
            0;
      const cy =
        e.clientY !== undefined
          ? e.clientY
          : (e.changedTouches &&
              e.changedTouches[0] &&
              e.changedTouches[0].clientY) ||
            0;
      if (st.dragging) {
        const likesRect =
          likesZoneRef.current && likesZoneRef.current.getBoundingClientRect();
        const dislikesRect =
          dislikesZoneRef.current &&
          dislikesZoneRef.current.getBoundingClientRect();
        let zone = null;
        if (
          likesRect &&
          cx >= likesRect.left &&
          cx <= likesRect.right &&
          cy >= likesRect.top &&
          cy <= likesRect.bottom
        ) {
          zone = "likes";
        } else if (
          dislikesRect &&
          cx >= dislikesRect.left &&
          cx <= dislikesRect.right &&
          cy >= dislikesRect.top &&
          cy <= dislikesRect.bottom
        ) {
          zone = "dislikes";
        }
        if (zone) {
          setPlacements((p) => ({ ...p, [filename]: zone }));
        }
      }
      cleanup();
    };

    const cleanup = () => {
      setDragPreview(null);
      dragStateRef.current = {};
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("touchmove", move, { passive: false });
      window.removeEventListener("touchend", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const total = items.length;
  const placedCount = Object.keys(placements).length;
  const finished = total > 0 && placedCount === total;

  const score = finished
    ? Object.keys(placements).reduce((s, f) => {
        const correctZone = answers.likes.includes(f) ? "likes" : "dislikes";
        return s + (placements[f] === correctZone ? 1 : 0);
      }, 0)
    : 0;

  return (
    <div
      className="gumball-overlay book-overlay food-overlay"
      onClick={handleOverlayClick}
    >
      <div className="gumball-popup" style={{ maxWidth: 720 }}>
        <h2 className="gumball-title">Food sorting!</h2>
        <p className="gumball-description">
          I'm quite the picky eater so try sorting my food hot takes!
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            ref={likesZoneRef}
            onDrop={(e) => onDropTo(e, "likes")}
            onDragOver={onDragOver}
            style={{
              minWidth: 160,
              flex: "1 1 200px",
              background: "#fffaf0",
              border: "3px solid #8b7355",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ fontWeight: 700, color: "#5d3d1a", marginBottom: 8 }}>
              Like
            </div>
            <div style={{ minHeight: 50 }}>
              {Object.keys(placements)
                .filter((f) => placements[f] === "likes")
                .map((f) => (
                  <img
                    key={f}
                    src={`assets/food/tastes/${f}`}
                    alt={f}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      margin: 6,
                      borderRadius: 8,
                    }}
                  />
                ))}
            </div>
          </div>

          <div
            ref={dislikesZoneRef}
            onDrop={(e) => onDropTo(e, "dislikes")}
            onDragOver={onDragOver}
            style={{
              minWidth: 160,
              flex: "1 1 200px",
              background: "#fffaf0",
              border: "3px solid #8b7355",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ fontWeight: 700, color: "#5d3d1a", marginBottom: 8 }}>
              Dislike
            </div>
            <div style={{ minHeight: 50 }}>
              {Object.keys(placements)
                .filter((f) => placements[f] === "dislikes")
                .map((f) => (
                  <img
                    key={f}
                    src={`assets/food/tastes/${f}`}
                    alt={f}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      margin: 6,
                      borderRadius: 8,
                    }}
                  />
                ))}
            </div>
          </div>
        </div>

        <div
          style={{ marginTop: 18, display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: 8,
              width: "100%",
              maxWidth: 560,
            }}
          >
            {shuffled.map((f) => {
              const placed = placements[f];
              // hide if placed
              if (placed) return null;
              return (
                <div
                  key={f}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    onPointerDown={
                      isTouchDevice ? (e) => startPointerDrag(e, f) : undefined
                    }
                    onTouchStart={
                      isTouchDevice ? (e) => startPointerDrag(e, f) : undefined
                    }
                    // Use HTML5 DnD on non-touch devices only
                    draggable={!isTouchDevice}
                    onDragStart={
                      !isTouchDevice ? (e) => onDragStart(e, f) : undefined
                    }
                    src={`assets/food/tastes/${f}`}
                    alt={f}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                      cursor: "grab",
                      touchAction: "none",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* floating drag preview for touch/pointer drags */}
        {dragPreview && (
          <div
            style={{
              position: "fixed",
              left: dragPreview.x - 40,
              top: dragPreview.y - 40,
              width: 80,
              height: 80,
              pointerEvents: "none",
              zIndex: 3000,
            }}
          >
            <img
              src={`assets/food/tastes/${dragPreview.file}`}
              alt={dragPreview.file}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        )}

        {finished && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, color: "#5d3d1a" }}>
              Score: {score} / {total}
            </div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {Object.keys(placements).map((f) => {
                const correct = answers.likes.includes(f)
                  ? "likes"
                  : "dislikes";
                const ok = placements[f] === correct;
                return (
                  <div key={f} style={{ textAlign: "center", width: 40 }}>
                    <img
                      src={`assets/food/tastes/${f}`}
                      alt={f}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: ok ? "3px solid #4caf50" : "3px solid #f44336",
                      }}
                    />
                    {/* <div
                      style={{ fontSize: 12, color: "#5d3d1a", marginTop: 6 }}
                    >
                      {ok ? "Correct" : "Wrong"}
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ShelfItem Component
function ShelfItem({ item, width, height }) {
  const [showGumballGame, setShowGumballGame] = useState(false);
  const [showBookRecs, setShowBookRecs] = useState(false);
  const [showMusicRecs, setShowMusicRecs] = useState(false);
  const [showWordleGame, setShowWordleGame] = useState(false);
  const [showFoodGame, setShowFoodGame] = useState(false);
  const [faceSrc, setFaceSrc] = useState(null);
  const [facePhase, setFacePhase] = useState(""); // "show" | "hide" | ""
  const containerRef = useRef(null);
  const [isLit, setIsLit] = useState(false);
  const mirrorTransitionRef = useRef(false);
  // speech bubble state for the "Me" item
  const SPEECH_OPTIONS = [
    "try clicking around!",
    "hellooooo!",
    "welcome to my shelves!",
  ];
  const [speechIndex, setSpeechIndex] = useState(0);

  // Mirror face lifecycle is now controlled by clicks: show, then persist.
  // Clicking while a face is visible will hide it, then replace it with a new face.
  // Use a ref to guard against rapid repeated clicks during the hide/replace transition.

  const loadRandomFace = async (exclude) => {
    // Only load faces from the test assets directory per project rules
    const tryPaths = [`${MIRROR_FACES_PATH}faces.json`];
    for (const p of tryPaths) {
      try {
        const resp = await fetch(p);
        if (!resp.ok) {
          console.debug("mirror: fetch not ok", p, resp.status);
          continue;
        }
        const raw = await resp.json();
        if (!raw || raw.length === 0) {
          console.debug("mirror: empty list", p);
          continue;
        }
        const base = p.replace(/faces.json$/, "");
        const fullList = raw.map((name) => base + name);
        let choices = fullList;
        if (exclude && fullList.length > 1) {
          choices = fullList.filter((f) => f !== exclude);
        }
        const pick = choices[Math.floor(Math.random() * choices.length)];
        console.debug("mirror: using", pick);
        return pick;
      } catch (err) {
        console.debug("mirror: fetch failed", p, err);
      }
    }
    // Final fallback to bundled names (works even without JSON)
    const FALLBACK = ["face1.svg", "face2.svg", "face3.svg"];
    const fullFallback = FALLBACK.map((n) => MIRROR_FACES_PATH + n);
    let choices = fullFallback;
    if (exclude && fullFallback.length > 1) {
      choices = fullFallback.filter((f) => f !== exclude);
    }
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const handleMirrorClick = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (mirrorTransitionRef.current) return;
    mirrorTransitionRef.current = true;

    // If no face visible -> load and show (persist)
    if (!faceSrc) {
      const src = await loadRandomFace();
      if (src) {
        setFaceSrc(src);
        // trigger CSS show class next tick
        setTimeout(() => setFacePhase("show"), 20);
      }
      mirrorTransitionRef.current = false;
      return;
    }

    // If a face is visible -> hide it, then replace with a new one
    setFacePhase("hide");
    // Hide animation is ~320ms in CSS; wait a bit extra before replacing
    setTimeout(async () => {
      const src = await loadRandomFace(faceSrc);
      if (src) {
        setFaceSrc(src);
        // new face should animate in
        setTimeout(() => setFacePhase("show"), 20);
      } else {
        setFaceSrc(null);
        setFacePhase("");
      }
      mirrorTransitionRef.current = false;
    }, 380);
  };

  const handleItemClick = (e) => {
    // If this is the "Me" item, cycle speech text and stop further handling
    if (item && (item.id === 0 || item.name === "Me")) {
      if (e && e.stopPropagation) e.stopPropagation();
      setSpeechIndex((i) => (i + 1) % SPEECH_OPTIONS.length);
      return;
    }
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
        if (result === "openBookRecs") {
          setShowBookRecs(true);
        }
        if (result === "openMusicRecs") {
          setShowMusicRecs(true);
        }
        if (result === "openWordleGame") {
          setShowWordleGame(true);
        }
        if (result === "openFoodGame") {
          setShowFoodGame(true);
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
          position: "relative",
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
        {/* speech bubble for the Me item: pointer stays anchored, bubble shifted right */}
        {item && (item.id === 0 || item.name === "Me") && (
          <div
            className="me-speech-wrapper"
            style={{
              position: "absolute",
              bottom: `${height - 10}px`,
              left: `2px`,
              zIndex: 2100,
              pointerEvents: "none",
            }}
          >
            {/* anchored pointer (stays in place) */}
            <div
              style={{
                position: "absolute",
                left: 24,
                bottom: -8,
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #fff3d6",
                pointerEvents: "none",
              }}
            />

            {/* bubble box shifted right visually; use same font as popups */}
            <div
              className="me-speech-box"
              onClick={(e) => {
                e.stopPropagation();
                setSpeechIndex((i) => (i + 1) % SPEECH_OPTIONS.length);
              }}
              style={{
                marginRight: 36,
                background: "#fff3d6",
                color: "#111",
                padding: "8px 12px",
                borderRadius: 12,
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                fontSize: 13,
                whiteSpace: "nowrap",
                fontFamily: '"Fredoka", sans-serif',
                pointerEvents: "auto",
              }}
            >
              {SPEECH_OPTIONS[speechIndex]}
            </div>
          </div>
        )}
        {/* mirror face overlay (appears from bottom then disappears) */}
        {faceSrc && (
          <div
            className="mirror-face-container"
            style={{ bottom: `${Math.max(6, Math.round(height * 0.32))}px` }}
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
      {showBookRecs && <BookRecs onClose={() => setShowBookRecs(false)} />}
      {showMusicRecs && <MusicRecs onClose={() => setShowMusicRecs(false)} />}
      {showWordleGame && (
        <WordleGame onClose={() => setShowWordleGame(false)} />
      )}
      {showFoodGame && <FoodGame onClose={() => setShowFoodGame(false)} />}
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
  const ITEM_GAP = 15;
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
          startingItemIndex + itemsPerShelf,
        );
        const shelfWidthUnits = shelfItems.reduce(
          (sum, item) => sum + item.width,
          0,
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
          startingItemIndex + 1,
        );
        const shelfWidthUnits = shelfItems.reduce(
          (sum, item) => sum + item.width,
          0,
        );
        bestLayout = Math.max(
          1,
          Math.floor(
            containerWidth / (MIN_ITEM_SIZE * shelfWidthUnits + ITEM_GAP),
          ),
        );
        bestSize = MIN_ITEM_SIZE;
      }

      // Distribute items across shelves
      // const newShelves = [];
      // for (let i = 0; i < totalItems; i += bestLayout) {
      const shelfItems = ITEMS.slice(
        startingItemIndex,
        startingItemIndex + bestLayout,
      );
      const shelfWidthUnits = shelfItems.reduce((sum, it) => sum + it.width, 0);
      const availableWidth =
        containerWidth - (shelfItems.length - 1) * ITEM_GAP;
      // Constrain to MIN/MAX and keep as float for precise layout
      const shelfSize = Math.max(
        MIN_ITEM_SIZE,
        Math.min(MAX_ITEM_SIZE, availableWidth / shelfWidthUnits),
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
