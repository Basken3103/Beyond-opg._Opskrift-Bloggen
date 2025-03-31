document.addEventListener("DOMContentLoaded", function () {
    const opskriftForm = document.getElementById("opskriftForm");
    const opskrifterContainer = document.getElementById("opskrifter");
    let editingIndex = null;

    function loadOpskrifter() {
        const savedOpskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
        opskrifterContainer.innerHTML = "";
        savedOpskrifter.forEach((opskrift, index) => addOpskriftToDOM(opskrift, index));
    }

    function saveOpskrifter(opskrifter) {
        localStorage.setItem("opskrifter", JSON.stringify(opskrifter));
    }

    function addOpskriftToDOM(opskrift, index) {
        const opskriftKort = document.createElement("div");
        opskriftKort.classList.add("opskrift-kort");

        opskriftKort.innerHTML = `
            <h3>${opskrift.titel}</h3>
            <p><strong>Ingredienser:</strong></p>
            <p>${opskrift.ingredienser.replace(/\n/g, "<br>")}</p>
            <p><strong>Fremgangsmåde:</strong></p>
            <p>${opskrift.fremgangsmade.replace(/\n/g, "<br>")}</p>
            <button class="edit-btn" data-index="${index}">Rediger</button>
            <button class="delete-btn" data-index="${index}">Slet</button>
        `;

        opskrifterContainer.appendChild(opskriftKort);
    }

    opskriftForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const titel = document.getElementById("titel").value;
        const ingredienser = document.getElementById("ingredienser").value;
        const fremgangsmade = document.getElementById("fremgangsmade").value;

        if (titel && ingredienser && fremgangsmade) {
            const savedOpskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
            if (editingIndex !== null) {
                // Opdater eksisterende opskrift
                savedOpskrifter[editingIndex] = { titel, ingredienser, fremgangsmade };
                editingIndex = null;
            } else {
                // Tilføj ny opskrift
                savedOpskrifter.push({ titel, ingredienser, fremgangsmade });
            }

            saveOpskrifter(savedOpskrifter);
            opskriftForm.reset();
            loadOpskrifter();
        }
    });

    opskrifterContainer.addEventListener("click", function (event) {
        const savedOpskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
        const index = event.target.dataset.index;

        if (event.target.classList.contains("delete-btn")) {
            // Slet opskrift
            savedOpskrifter.splice(index, 1);
            saveOpskrifter(savedOpskrifter);
            loadOpskrifter();
        }

        if (event.target.classList.contains("edit-btn")) {
            // Rediger opskrift
            const opskrift = savedOpskrifter[index];
            document.getElementById("titel").value = opskrift.titel;
            document.getElementById("ingredienser").value = opskrift.ingredienser;
            document.getElementById("fremgangsmade").value = opskrift.fremgangsmade;
            editingIndex = index;
        }
    });

    loadOpskrifter();
});


