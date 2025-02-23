document.addEventListener("DOMContentLoaded", () => {
    const notesList = document.getElementById("notesList");
    const clearNotesBtn = document.getElementById("clearNotes");

    function loadNotes() {
        notesList.innerHTML = "";
        const notes = localStorage.getItem("notes") || "";
        const notesArray = notes.split("\n").filter(note => note.trim());

        notesArray.forEach((note, index) => {
            const li = document.createElement("li");

            // Editable Input Field (Auto Expanding)
            const input = document.createElement("textarea");
            input.value = note;
            input.rows = 1; // Default to 1 row
            input.style.overflow = "hidden";
            input.style.resize = "none";
            autoResize(input);

            // Save on blur or Enter key
            input.addEventListener("blur", () => updateNote(index, input.value));
            input.addEventListener("input", () => autoResize(input));
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    input.blur();
                }
            });

            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "🗑️";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => deleteNote(index));

            li.appendChild(input);
            li.appendChild(deleteBtn);
            notesList.appendChild(li);
        });
    }

    function updateNote(index, newText) {
        const notesArray = (localStorage.getItem("notes") || "").split("\n").filter(note => note.trim());
        notesArray[index] = newText.trim();
        localStorage.setItem("notes", notesArray.join("\n"));
    }

    function deleteNote(index) {
        const notesArray = (localStorage.getItem("notes") || "").split("\n").filter(note => note.trim());
        notesArray.splice(index, 1);
        localStorage.setItem("notes", notesArray.join("\n"));
        loadNotes();
    }

    function autoResize(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

    clearNotesBtn.addEventListener("click", () => {
        localStorage.removeItem("notes");
        loadNotes();
    });

    window.addEventListener("storage", (event) => {
        if (event.key === "notes") {
            loadNotes();
        }
    });

    loadNotes();
});
