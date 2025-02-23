let mediaRecorder;
let currentSegmentRecorder;
let audioChunks = [];
let segmentChunks = [];
let isRecording = false;
let isSegmentRecording = false;

const recordBtn = document.getElementById('recordBtn');
const cutBtn = document.getElementById('cutBtn');
const audioElement = document.getElementById('audio');
const cutList = document.getElementById('cut-list');

recordBtn.addEventListener('click', async () => {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const fullAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                audioElement.src = URL.createObjectURL(fullAudioBlob);
            };

            mediaRecorder.start();
            isRecording = true;
            recordBtn.textContent = "Stop Recording";
            cutBtn.disabled = false;
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    } else {
        mediaRecorder.stop();
        isRecording = false;
        recordBtn.textContent = "Start Recording";
        cutBtn.disabled = true;
    }
});

cutBtn.addEventListener('click', async () => {
    if (!isSegmentRecording) {
        // Start recording a segment
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            currentSegmentRecorder = new MediaRecorder(stream);
            segmentChunks = [];

            currentSegmentRecorder.ondataavailable = event => {
                segmentChunks.push(event.data);
            };

            currentSegmentRecorder.onstop = () => {
                if (segmentChunks.length > 0) {
                    const segmentBlob = new Blob(segmentChunks, { type: 'audio/webm' });
                    createCutSegment(segmentBlob);
                }
            };

            currentSegmentRecorder.start();
            isSegmentRecording = true;
            cutBtn.textContent = "Cut Stop";
        } catch (error) {
            console.error("Error accessing microphone for segment:", error);
        }
    } else {
        // Stop recording the segment
        currentSegmentRecorder.stop();
        isSegmentRecording = false;
        cutBtn.textContent = "Cut Start";
    }
});

function createCutSegment(audioBlob) {
    const cutUrl = URL.createObjectURL(audioBlob);

    const listItem = document.createElement('li');
    const cutAudio = document.createElement('audio');
    cutAudio.src = cutUrl;
    cutAudio.controls = true;
    listItem.innerHTML = `Segment ${cutList.children.length + 1}: `;
    listItem.appendChild(cutAudio);
    cutList.appendChild(listItem);
}
