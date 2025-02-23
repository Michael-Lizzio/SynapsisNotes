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
