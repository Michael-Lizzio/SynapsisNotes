import { OPENAI_API_KEY } from "./secrets.js"; // Ensure this file exists and contains your API key

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
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
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
