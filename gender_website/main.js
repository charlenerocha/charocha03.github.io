// Lightweight interactivity: reveal sections, smooth nav, glossary enhancement, reflection prompt
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    },
    { threshold: 0.12 },
  );
  sections.forEach((s) => io.observe(s));

  // TOC buttons -> smooth scroll
  document.querySelectorAll(".toc button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    btn.addEventListener("keyup", (e) => {
      if (e.key === "Enter") btn.click();
    });
  });

  // Reflection prompt: allow small private note saved to localStorage
  document.querySelectorAll(".callout").forEach((call) => {
    call.style.cursor = "pointer";
    call.title = "Click to write a private reflection (only saved locally)";
    call.addEventListener("click", async () => {
      const prev = localStorage.getItem("gender-reflection") || "";
      const note = prompt(
        "Write a short reflection (only saved locally):",
        prev,
      );
      if (note !== null) {
        localStorage.setItem("gender-reflection", note);
        call.textContent = note.trim() ? note : "Reflection saved (empty)";
        setTimeout(() => {
          call.textContent = note.trim() ? note : "Reflection saved (empty)";
        }, 10);
      }
    });
  });

  // Improve <details> keyboard behavior for accessibility
  document.querySelectorAll(".glossary details").forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) d.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // Quiz interaction: multiple-choice with immediate feedback (generic handler)
  document.querySelectorAll(".quiz").forEach((quiz, index) => {
    const correct = quiz.dataset.correct;
    const choices = quiz.querySelectorAll(".quiz-choice");
    const feedback = quiz.querySelector(".quiz-feedback");

    // per-quiz custom messages (fallback to generic)
    const msgCorrect =
      quiz.dataset.feedbackCorrect ||
      "Correct — nice work. This matches the main idea in the section.";
    const msgIncorrect =
      quiz.dataset.feedbackIncorrect ||
      "Not quite — review the section; the correct answer is highlighted.";

    choices.forEach((btn) => {
      btn.setAttribute("role", "button");
      btn.addEventListener("click", () => {
        // disable further clicks
        choices.forEach((c) => (c.disabled = true));
        const picked = btn.dataset.choice;
        if (picked === correct) {
          btn.classList.add("correct");
          if (feedback) {
            feedback.textContent = msgCorrect;
            feedback.classList.remove("error");
            feedback.classList.add("success");
          }
        } else {
          btn.classList.add("incorrect");
          // highlight correct answer visually
          choices.forEach((c) => {
            if (c.dataset.choice === correct) c.classList.add("correct");
          });
          if (feedback) {
            feedback.textContent = msgIncorrect;
            feedback.classList.remove("success");
            feedback.classList.add("error");
          }
        }
        // set aria-pressed on choices for a11y
        choices.forEach((c) =>
          c.setAttribute("aria-pressed", c === btn ? "true" : "false"),
        );
      });
      // keyboard support
      btn.addEventListener("keyup", (e) => {
        if (e.key === "Enter" || e.key === " ") btn.click();
      });
    });
  });
});
