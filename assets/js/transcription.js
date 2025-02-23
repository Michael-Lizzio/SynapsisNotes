    // Show a custom notification that slides in/out from the top-right
    function showNotification(message) {
      const container = document.getElementById("notification-container");
      if (!container) return;
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.textContent = message;
      container.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  
    function loadTranscript() {
        document.getElementById("transcriptText").textContent = localStorage.getItem("transcript") || "No transcript available.";
      }
  
    document.getElementById("clearTranscript").addEventListener("click", () => {
      localStorage.removeItem("transcript");
      loadTranscript();
      showNotification("Transcript cleared.");
    });
  
    document.getElementById("copyTranscript").addEventListener("click", () => {
      const transcript = localStorage.getItem("transcript") || "";
      navigator.clipboard.writeText(transcript)
        .then(() => showNotification("Transcript copied to clipboard!"))
        .catch(() => showNotification("Failed to copy transcript."));
    });
  
    document.getElementById("importTranscript").addEventListener("click", () => {
      document.getElementById("transcriptFileInput").click();
    });
  
    document.getElementById("transcriptFileInput").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        localStorage.setItem("transcript", text);
        loadTranscript();
        showNotification("Transcript imported successfully!");
      };
      reader.readAsText(file);
    });
  
    document.getElementById("exportTranscript").addEventListener("click", () => {
      const transcript = localStorage.getItem("transcript") || "";
      const blob = new Blob([transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transcript.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  
    // Update transcript if changes occur in other tabs
    window.addEventListener("storage", (event) => {
      if (event.key === "transcript") loadTranscript();
    });
  
    loadTranscript();
  