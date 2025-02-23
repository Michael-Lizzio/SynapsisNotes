// transcriber.js
import { OPENAI_API_KEY } from "./secrets.js";
import { handleTranscription } from "./breakout.js";

/**
 * Transcribes an audio file by sending it to the OpenAI API.
 * @param {Blob} audioFile - The audio file (e.g., recorded segment) to transcribe.
 */
export async function transcribeAudioFile(audioFile) {
  // Prepare form data with the audio file and model specification
  const formData = new FormData();
  formData.append("file", audioFile, "audio.webm");
  formData.append("model", "whisper-1");

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
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
