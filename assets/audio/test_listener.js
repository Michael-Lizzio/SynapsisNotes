document.getElementById("recordButton").addEventListener("click", startTestTranscription);

let testAudioFiles = [
    "assets/audio/test1.mp3",
    "assets/audio/test2.mp3",
    "assets/audio/test3.mp3",
    "assets/audio/test4.mp3"
];

function startTestTranscription() {
    console.log("Sending test audio files to transcriber.js...");

    testAudioFiles.forEach((file, index) => {
        setTimeout(() => {
            sendToTranscriber(file);
        }, index * 5000); // Send one file every 5 seconds
    });
}

function sendToTranscriber(audioFile) {
    console.log(`Sending: ${audioFile}`);

    // Simulate sending the audio file to transcriber.js
    window.postMessage({ file: audioFile }, "*");
}
