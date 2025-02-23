import { handleTranscription } from "./breakout.js";

/**
 * Manually send a transcript for testing.
 * Call this function in the console like: testTranscript("Your test transcript here");
 * @param {string} transcript - The transcript text to test.
 */
window.testTranscript = function (transcript) {
    console.log("Sending test transcript:", transcript);
    handleTranscription(transcript);
};
