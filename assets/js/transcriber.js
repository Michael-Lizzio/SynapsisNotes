// transcriber.js
import { handleTranscription } from "./breakout.js";


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

function getConfig() {
  return JSON.parse(localStorage.getItem("settings")) || DEFAULT_CONFIG;
}

/**
 * Transcribes an audio file by sending it to the OpenAI API.
 * @param {Blob} audioFile - The audio file (e.g., recorded segment) to transcribe.
 */
export async function transcribeAudioFile(audioFile) {
  const settings = getConfig();
    const apiKey = settings.apiKey;

    if (!apiKey) {
        console.error("No API key set! Please enter it in the settings.");
        return;
    }


  // Prepare form data with the audio file and model specification
  const formData = new FormData();
  formData.append("file", audioFile, "audio.webm");
  formData.append("model", "whisper-1");

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Transcription request failed: " + response.statusText);
    }

    const data = await response.json();
    const transcript = data.text;
    
    // Send the transcript to breakout.js for further processing
    handleTranscription(transcript);
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
}
