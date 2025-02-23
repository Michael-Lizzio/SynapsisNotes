document.addEventListener("DOMContentLoaded", () => {
    let receivedFiles = [];

    function receiveAudioFile(audioFile) {
        console.log(`Received test audio file: ${audioFile}`);
        receivedFiles.push(audioFile);
    }

    window.addEventListener("message", (event) => {
        if (event.data.file) {
            console.log(`Received message in test_receiver: ${event.data.file}`);
            receiveAudioFile(event.data.file);
        }
    });
});
