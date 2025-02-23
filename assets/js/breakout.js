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

const BULLET_POINT_RATIO = 50; // Number of words per bullet point (adjustable)

/**
 * Handles the transcript received from the transcription service.
 * Stores and updates it in localStorage, then sends it to AI for note-taking.
 * @param {string} transcript - The transcribed text.
 */
export function handleTranscription(transcript) {
    console.log("Transcription:", transcript);
    appendToTranscript(transcript);
    aiNotes(transcript);
    checkForQuestion(transcript);
}

/**
 * Saves the transcript to localStorage.
 * @param {string} transcript - The transcript text to save.
 */
export function saveTranscript(transcript) {
    localStorage.setItem("transcript", transcript);
}

/**
 * Retrieves the transcript from localStorage.
 * @returns {string} - The stored transcript or an empty string if none exists.
 */
export function getTranscript() {
    return localStorage.getItem("transcript") || "";
}

/**
 * Appends new text to the stored transcript.
 * @param {string} newText - The new text to append.
 */
export function appendToTranscript(newText) {
    let transcript = getTranscript();
    transcript += `\n${newText}`;
    saveTranscript(transcript);
}

/**
 * Deletes the stored transcript from localStorage.
 */
export function clearTranscript() {
    localStorage.removeItem("transcript");
    console.log("Transcript cleared.");
}

/**
 * Saves notes to localStorage.
 * @param {string} notes - The notes to save.
 */
export function saveNotes(notes) {
    localStorage.setItem("notes", notes);
}

/**
 * Retrieves notes from localStorage.
 * @returns {string} - The stored notes or an empty string if none exist.
 */
export function getNotes() {
    return localStorage.getItem("notes") || "";
}

/**
 * Appends new notes to the stored notes.
 * @param {string} newNotes - The new notes to append.
 */
export function appendToNotes(newNotes) {
    let notes = getNotes();
    notes += `\n${newNotes}`;
    saveNotes(notes);
}

/**
 * Deletes the stored notes from localStorage.
 */
export function clearNotes() {
    localStorage.removeItem("notes");
    console.log("Notes cleared.");
}

/**
 * Calls OpenAI's API to generate AI-based notes from the transcript.
 * @param {string} transcript - The transcript text.
 */
async function aiNotes(transcript) {
    const settings = getConfig();
    const apiKey = settings.apiKey;

    if (!apiKey) {
        console.error("No API key set! Please enter it in the settings.");
        return;
    }

    const words = transcript.split(/\s+/).length;
    const bulletCount = Math.max(3, Math.floor(words / BULLET_POINT_RATIO));

    let lastNotes = getNotes().split("\n").filter(note => note.trim());
    let lastTwoNotes = lastNotes.slice(-2).join("\n");

    let prompt = `Summarize the following text into ${bulletCount} concise bullet points:\n\n"${transcript}"`;
    
    if (lastTwoNotes.length > 0) {
        prompt += `\n\nHere are the last two notes for context:\n"${lastTwoNotes}"`;
    }

    console.log("Sending request to OpenAI:", prompt);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful assistant that takes notes concisely." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch AI notes: " + response.statusText);
        }

        const data = await response.json();
        let aiGeneratedNotes = data.choices[0].message.content.trim();

        console.log("AI Generated Notes:", aiGeneratedNotes);

        appendToNotes(aiGeneratedNotes);
    } catch (error) {
        console.error("Error generating AI notes:", error);
    }
}

async function checkForQuestion(transcript) {
    // Only run if detection is enabled
    if (localStorage.getItem("detectQuestion") !== "true") return;
    
    const config = getConfig(); // from your shared code
    const apiKey = config.apiKey;
    if (!apiKey) return; // exit if no API key
  
    // Build a prompt to ask: does the transcript contain a question? If yes, answer it; if not, reply with "No".
    const prompt = `Please analyze the following transcript. If it contains a question (e.g., a teacher asking something), answer that question be pretty sensitive even if it might not be a question assume it might be; if not, reply with "No".\n\n${transcript}`;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful assistant that extracts and answers questions from transcripts." },
            { role: "user", content: prompt }
          ],
          temperature: 0.5,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to detect question: " + response.statusText);
      }
      const data = await response.json();
      const answer = data.choices[0].message.content.trim();

      console.log(answer);
      // Check if the answer does NOT start with "No" within the first 6 characters
      if (answer.slice(0, 6).toLowerCase().indexOf("no") === -1) {
        // Display the answer in the detector area
        const detectedElem = document.getElementById("detectedQuestion");
        detectedElem.innerText = answer;
        detectedElem.style.display = "block";
        localStorage.setItem("current_question", answer);
      }
    } catch (error) {
      console.error("Error detecting question:", error);
    }
  }
  
  // Example: after processing the transcript (like in aiNotes or handleTranscription)
  // if (localStorage.getItem("detectQuestion") === "true") {
  //    checkForQuestion(transcript);
  // }
  
