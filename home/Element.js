function Element({
  image,
  clickable = false,
  frame = false,
  hangingFrame = false,
  washiTape = "None",
  position = { top: 0, left: 0 },
  width = 200,
}) {
  const [showPopup, setShowPopup] = React.useState(false);

  const handleClick = () => {
    if (clickable) {
      setShowPopup(true);
    }
  };

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const elementStyle = {
    position: "absolute",
    top: typeof position.top === "string" ? position.top : position.top + "%",
    left:
      typeof position.left === "string" ? position.left : position.left + "%",
    width: typeof width === "string" ? width : width + "%",
  };

  return (
    <>
      <div
        className={`element ${clickable ? "clickable" : ""} ${
          frame ? "framed" : ""
        } ${hangingFrame ? "hanging-frame" : ""}`}
        style={elementStyle}
        onClick={handleClick}
      >
        {hangingFrame && (
          <div className="hanging-string">
            <div className="string-left"></div>
            <div className="string-right"></div>
            <div className="suspension-point-left"></div>
            <div className="suspension-point-right"></div>
          </div>
        )}
        {!hangingFrame && washiTape !== "None" && (
          <div className={`washi-tape washi-${washiTape.toLowerCase()}`}></div>
        )}
        <img src={image} alt="Element" />
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup" onClick={handlePopupClick}>
            {/* Blue square popup placeholder */}
          </div>
        </div>
      )}
    </>
  );
}
