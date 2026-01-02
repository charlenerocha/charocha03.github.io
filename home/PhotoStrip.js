function PhotoStrip({
  images,
  clickable = false,
  frame = false,
  washiTape = "None",
  position = { top: 0, left: 0 },
  width = 150,
}) {
  const [showPopup, setShowPopup] = React.useState(false);

  if (!images || images.length < 3 || images.length > 5) {
    return <div>PhotoStrip requires 3-5 images</div>;
  }

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

  const photoStripStyle = {
    position: "absolute",
    top: typeof position.top === "string" ? position.top : position.top + "%",
    left:
      typeof position.left === "string" ? position.left : position.left + "%",
    width: typeof width === "string" ? width : width + "%",
  };

  return (
    <>
      <div
        className={`photo-strip ${clickable ? "clickable" : ""} ${
          frame ? "framed" : ""
        }`}
        style={photoStripStyle}
        onClick={handleClick}
      >
        {washiTape !== "None" && (
          <div className={`washi-tape washi-${washiTape.toLowerCase()}`}></div>
        )}
        <div className="photo-strip-container">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Photo ${index + 1}`}
              className="strip-photo"
            />
          ))}
        </div>
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
