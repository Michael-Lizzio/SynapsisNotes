const DEFAULT_CONFIG = {
    calibrationDuration: 5000,
    speechStartThresholdMultiplier: 2,
    speechStopThresholdMultiplier: 1.2,
    speechStartDuration: 2300,
    silenceDuration: 1900,
    minSegmentDuration: 1000,
    minimumRecordingLength: 10000,
    baseLineMultiplier: 1.4,
    apiKey: ""
};

// Existing code that loads/saves settings remains...

document.getElementById("calibrateBtn").addEventListener("click", calibrateBaseline);

async function calibrateBaseline() {
  try {
    // Request microphone access for calibration
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    // Use the calibration duration from settings (or default to 5000ms)
    const calibrationDuration = parseInt(document.getElementById("calibrationDuration").value) || 5000;
    let calibrationSamples = [];
    const calibrationStatus = document.getElementById("calibrationStatus");
    const calibrationProgress = document.getElementById("calibrationProgress");
    let startTime = performance.now();

    calibrationStatus.textContent = "Calibrating...";

    function update() {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const normalizedVolume = avg / 255;
      calibrationSamples.push(normalizedVolume);

      // Update progress bar based on elapsed time
      let elapsed = performance.now() - startTime;
      let percent = Math.min(100, (elapsed / calibrationDuration) * 100);
      calibrationProgress.style.width = percent + "%";

      if (elapsed < calibrationDuration) {
        requestAnimationFrame(update);
      } else {
        // Compute average baseline level
        const baseline = calibrationSamples.reduce((a, b) => a + b, 0) / calibrationSamples.length;
        calibrationStatus.textContent = "Calibration Complete: " + baseline.toFixed(3);
        // Optionally, apply a factor to adjust the baseline further if desired:
        const finalBaseline = baseline; // or baseline * 1.0, etc.

        // Update the Baseline Multiplier input field
        document.getElementById("baseLineMultiplier").value = finalBaseline.toFixed(3);

        // Save new settings (using your existing save code)
        const newSettings = {
          calibrationDuration: parseInt(document.getElementById("calibrationDuration").value),
          speechStartThresholdMultiplier: parseFloat(document.getElementById("speechStartThresholdMultiplier").value),
          speechStopThresholdMultiplier: parseFloat(document.getElementById("speechStopThresholdMultiplier").value),
          speechStartDuration: parseInt(document.getElementById("speechStartDuration").value),
          silenceDuration: parseInt(document.getElementById("silenceDuration").value),
          minSegmentDuration: parseInt(document.getElementById("minSegmentDuration").value),
          minimumRecordingLength: parseInt(document.getElementById("minimumRecordingLength").value),
          baseLineMultiplier: finalBaseline,
          apiKey: document.getElementById("apiKey").value.trim()
        };
        localStorage.setItem("settings", JSON.stringify(newSettings));

        // Stop the microphone stream
        stream.getTracks().forEach(track => track.stop());
      }
    }
    update();
  } catch (err) {
    console.error("Error during calibration:", err);
    alert("Microphone access is required for calibration.");
  }
}



// Load settings from localStorage or default
function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem("settings")) || DEFAULT_CONFIG;
    document.getElementById("calibrationDuration").value = savedSettings.calibrationDuration;
    document.getElementById("speechStartThresholdMultiplier").value = savedSettings.speechStartThresholdMultiplier;
    document.getElementById("speechStopThresholdMultiplier").value = savedSettings.speechStopThresholdMultiplier;
    document.getElementById("speechStartDuration").value = savedSettings.speechStartDuration;
    document.getElementById("silenceDuration").value = savedSettings.silenceDuration;
    document.getElementById("minSegmentDuration").value = savedSettings.minSegmentDuration;
    document.getElementById("minimumRecordingLength").value = savedSettings.minimumRecordingLength;
    document.getElementById("baseLineMultiplier").value = savedSettings.baseLineMultiplier;
    document.getElementById("apiKey").value = savedSettings.apiKey;
}

// Save settings to localStorage
document.getElementById("settingsForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const newSettings = {
        calibrationDuration: parseInt(document.getElementById("calibrationDuration").value),
        speechStartThresholdMultiplier: parseFloat(document.getElementById("speechStartThresholdMultiplier").value),
        speechStopThresholdMultiplier: parseFloat(document.getElementById("speechStopThresholdMultiplier").value),
        speechStartDuration: parseInt(document.getElementById("speechStartDuration").value),
        silenceDuration: parseInt(document.getElementById("silenceDuration").value),
        minSegmentDuration: parseInt(document.getElementById("minSegmentDuration").value),
        minimumRecordingLength: parseInt(document.getElementById("minimumRecordingLength").value),
        baseLineMultiplier: parseFloat(document.getElementById("baseLineMultiplier").value),
        apiKey: document.getElementById("apiKey").value.trim()
    };

    localStorage.setItem("settings", JSON.stringify(newSettings));
    alert("Settings saved successfully!");
});

// Reset to default settings
document.getElementById("resetSettings").addEventListener("click", () => {
    localStorage.setItem("settings", JSON.stringify(DEFAULT_CONFIG));
    loadSettings();
    alert("Settings reset to default.");
});

// Load settings on page load
loadSettings();
