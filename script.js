const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

// Load saved notes
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Load saved theme
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

// Save notes to localStorage
function saveNotes(){
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Render notes
function renderNotes(){
    notesContainer.innerHTML = "";

    // Sort pinned notes first
    const sortedNotes = notes.slice().sort((a,b)=> b.pinned - a.pinned);

    // Filter by search
    sortedNotes
    .filter(noteObj => noteObj.text.toLowerCase().includes(searchInput.value.toLowerCase()))
    .forEach((noteObj, index)=>{

        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");

        const noteText = document.createElement("p");
        noteText.textContent = noteObj.text;

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("note-buttons");

        // Pin button
        const pinBtn = document.createElement("button");
        pinBtn.textContent = noteObj.pinned ? "📌 Pinned" : "📌 Pin";
        pinBtn.classList.add("pin-btn");
        pinBtn.onclick = ()=>{
            noteObj.pinned = !noteObj.pinned;
            saveNotes();
            renderNotes();
        };

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.onclick = ()=>{
            const newText = prompt("Edit your note", noteObj.text);
            if(newText !== null){
                noteObj.text = newText;
                saveNotes();
                renderNotes();
            }
        };

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = ()=>{
            notes.splice(index,1);
            saveNotes();
            renderNotes();
        };

        btnContainer.appendChild(pinBtn);
        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        noteDiv.appendChild(noteText);
        noteDiv.appendChild(btnContainer);

        notesContainer.appendChild(noteDiv);
    });
}

// Add new note
addBtn.onclick = ()=>{
    const noteText = noteInput.value.trim();
    if(noteText === "") return;

    notes.push({text: noteText, pinned: false});
    saveNotes();
    renderNotes();
    noteInput.value = "";
};

// Search notes
searchInput.addEventListener("input", renderNotes);

// Theme toggle
function updateThemeButtonText() {
    if(document.body.classList.contains("dark-mode")){
        themeToggle.textContent = "🌙 Dark Mode"; // shows current mode
    } else {
        themeToggle.textContent = "☀️ Light Mode"; // shows current mode
    }
}

// Load saved theme
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}
updateThemeButtonText();

themeToggle.onclick = ()=>{
    document.body.classList.toggle("dark-mode");

    // save current mode
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");

    // update button text
    updateThemeButtonText();
};

// Initial render
renderNotes();