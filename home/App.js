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
        position={{ top: "5vh", left: "5vw" }}
        width="20vw"
      />

      {/* Non-clickable with left edge washi tape */}
      <Element
        image="../assets/img/portfolio/citizen.jpg"
        clickable={false}
        frame={false}
        washiTape="LeftEdge"
        position={{ top: "10vh", left: "35vw" }}
        width="18vw"
      />

      {/* Clickable with frame, no washi tape */}
      <Element
        image="../assets/img/resume/google.png"
        clickable={true}
        frame={true}
        washiTape="None"
        position={{ top: "35vh", left: "8vw" }}
        width="12vw"
      />

      {/* Non-clickable with right edge washi tape */}
      <Element
        image="../assets/img/stem/breadboard.jpg"
        clickable={false}
        frame={false}
        washiTape="RightEdge"
        position={{ top: "28vh", left: "65vw" }}
        width="15vw"
      />

      {/* Clickable, no frame, top washi tape */}
      <Element
        image="../assets/img/portfolio/ted.jpg"
        clickable={true}
        frame={false}
        washiTape="Top"
        position={{ top: "60vh", left: "25vw" }}
        width="18vw"
      />

      {/* Simple element with frame only */}
      <Element
        image="../assets/img/pfp.png"
        clickable={true}
        frame={true}
        washiTape="None"
        position={{ top: "55vh", left: "55vw" }}
        width="14vw"
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
        position={{ top: "15vh", left: "75vw" }}
        width="10vw"
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
        position={{ top: "70vh", left: "50vw" }}
        width="14vw"
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
        position={{ top: "75vh", left: "10vw" }}
        width="12vw"
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
