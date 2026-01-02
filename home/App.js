function App() {
  return (
    <div className="app">
      {/* ========== ELEMENT SAMPLES ========== */}

      {/* Clickable with frame and top washi tape */}
      <Element
        image="../assets/img/portfolio/btcp.jpg"
        clickable={true}
        frame={true}
        washiTape="Top"
        position={{ top: 5, left: 5 }}
        width={20}
      />

      {/* Non-clickable with left edge washi tape */}
      <Element
        image="../assets/img/portfolio/citizen.jpg"
        clickable={false}
        frame={false}
        washiTape="LeftEdge"
        position={{ top: 10, left: 35 }}
        width={18}
      />

      {/* Clickable with frame, no washi tape */}
      <Element
        image="../assets/img/resume/google.png"
        clickable={true}
        frame={true}
        washiTape="None"
        position={{ top: 35, left: 8 }}
        width={12}
      />

      {/* Non-clickable with right edge washi tape */}
      <Element
        image="../assets/img/stem/breadboard.jpg"
        clickable={false}
        frame={false}
        washiTape="RightEdge"
        position={{ top: 28, left: 65 }}
        width={15}
      />

      {/* Clickable, no frame, top washi tape */}
      <Element
        image="../assets/img/portfolio/ted.jpg"
        clickable={true}
        frame={false}
        washiTape="Top"
        position={{ top: 60, left: 25 }}
        width={18}
      />

      {/* Simple element with frame only */}
      <Element
        image="../assets/img/pfp.png"
        clickable={true}
        frame={true}
        washiTape="None"
        position={{ top: 55, left: 55 }}
        width={14}
      />

      {/* Hanging frame with map */}
      <Element
        image="assets/map.jpg"
        clickable={true}
        hangingFrame={true}
        position={{ top: 40, left: 40 }}
        width={16}
      />

      {/* ========== PHOTOSTRIP SAMPLES ========== */}

      {/* 4-image photostrip with frame */}
      <PhotoStrip
        images={[
          "../assets/img/portfolio/hand.jpg",
          "../assets/img/portfolio/protest.jpg",
          "../assets/img/portfolio/show.jpg",
          "../assets/img/portfolio/speech.JPG",
        ]}
        clickable={true}
        frame={true}
        washiTape="None"
        position={{ top: 15, left: 75 }}
        width={10}
      />

      {/* 5-image photostrip with top washi tape */}
      <PhotoStrip
        images={[
          "../assets/img/stem/breadboard.jpg",
          "../assets/img/stem/lego.jpg",
          "../assets/img/stem/IMG_20200110_234646.jpg",
          "../assets/img/portfolio/group-pic.jpg",
          "../assets/img/portfolio/group-pic-2.jpg",
        ]}
        clickable={true}
        frame={false}
        washiTape="Top"
        position={{ top: 70, left: 50 }}
        width={14}
      />

      {/* 3-image photostrip with left washi tape and frame */}
      <PhotoStrip
        images={[
          "../assets/img/resume/uwaterloo.png",
          "../assets/img/resume/datadog.png",
          "../assets/img/resume/iRegained.png",
        ]}
        clickable={false}
        frame={true}
        washiTape="LeftEdge"
        position={{ top: 75, left: 10 }}
        width={12}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
