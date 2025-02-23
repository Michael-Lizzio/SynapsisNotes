document.addEventListener("DOMContentLoaded", function () {
    const detector = document.getElementById("questionDetector");
    const toggleButton = document.getElementById("toggleDetector");
    const detectorContent = document.getElementById("detectorContent");
  
    // Initially, ensure detection is off
    localStorage.setItem("detectQuestion", "false");
    localStorage.removeItem("current_question");
  
    // Toggle dropdown expansion when the button is clicked
    toggleButton.addEventListener("click", function (e) {
      e.stopPropagation(); // prevent parent click events
      if (detector.classList.contains("detector-collapsed")) {
        // Expand the dropdown
        detector.classList.remove("detector-collapsed");
        detector.classList.add("detector-expanded");
        detectorContent.style.display = "block";
        toggleButton.textContent = "▲";
        localStorage.setItem("detectQuestion", "true");
        localStorage.removeItem("current_question");
      } else {
        // Collapse the dropdown
        detector.classList.remove("detector-expanded");
        detector.classList.add("detector-collapsed");
        detectorContent.style.display = "none";
        toggleButton.textContent = "▼";
        localStorage.setItem("detectQuestion", "false");
      }
    });
  });
  