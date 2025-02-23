// Show a custom notification that slides in/out from the top-right
function showNotification(message) {
    const container = document.getElementById("notification-container");
    if (!container) return;
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    container.appendChild(notification);
    // Remove notification after the animation completes (3 seconds)
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  function loadNotes() {
    const notesContainer = document.getElementById("notesList");
    notesContainer.innerHTML = "";
    const notes = localStorage.getItem("notes") || "";
    const notesArray = notes.split("\n").filter(note => note.trim());
    notesArray.forEach(note => {
      const li = document.createElement("li");
      li.textContent = note;
      notesContainer.appendChild(li);
    });
  }
  
  document.getElementById("clearNotes").addEventListener("click", () => {
    localStorage.removeItem("notes");
    loadNotes();
    showNotification("Notes cleared.");
  });
  
  document.getElementById("copyNotes").addEventListener("click", () => {
    const notes = localStorage.getItem("notes") || "";
    navigator.clipboard.writeText(notes)
      .then(() => showNotification("Notes copied to clipboard!"))
      .catch(() => showNotification("Failed to copy notes."));
  });
  
  document.getElementById("importNotes").addEventListener("click", () => {
    document.getElementById("notesFileInput").click();
  });
  
  document.getElementById("notesFileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      localStorage.setItem("notes", text);
      loadNotes();
      showNotification("Notes imported successfully!");
    };
    reader.readAsText(file);
  });
  
  document.getElementById("exportNotes").addEventListener("click", () => {
    const notes = localStorage.getItem("notes") || "";
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
  
  window.addEventListener("storage", (event) => {
    if (event.key === "notes") loadNotes();
  });
  
  loadNotes();
  