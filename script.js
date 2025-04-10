document.addEventListener("DOMContentLoaded", function () {
    const opskriftForm = document.getElementById("opskriftForm");
    const opskrifterContainer = document.getElementById("opskrifter");
    const kategori = document.getElementById("kategori").value;
    const nyOpskrift = { titel, ingredienser, fremgangsmade, kategori };
    let editingIndex = null; // Holder styr på hvilken opskrift der redigeres

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
            <p><strong>Kategori:</strong> ${opskrift.kategori || "Ikke angivet"}</p>
            <button class="edit-btn" data-index="${index}">Rediger</button>
            <button class="delete-btn" data-index="${index}">Slet</button>

            <div class="comments-section">
               <textarea id="commentInput-${index}" placeholder="Skriv en kommentar..."></textarea>
               <button class="comment-btn" data-index="${index}">Kommenter</button>
               <ul class="comments-list" id="comments-${index}">
                ${opskrift.comments ? opskrift.comments.map(comment => `<li>${comment}</li>`).join('') : ''}
              </ul>
         </div>

        `;

        opskrifterContainer.appendChild(opskriftKort);
    }

    // Filtrering:
    function filtrereOpskrifter(kategori) {
        const savedOpskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
        return savedOpskrifter.filter(opskrift => opskrift.kategori === kategori);
    }

    document.getElementById("søgning").addEventListener("input", function () {
        const søgeord = this.value.toLowerCase();
        const opskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
        const resultater = opskrifter.filter(opskrift => {
            return opskrift.titel.toLowerCase().includes(søgeord) ||
                opskrift.ingredienser.toLowerCase().includes(søgeord) ||
                opskrift.fremgangsmade.toLowerCase().includes(søgeord);
        });
        opskrifterContainer.innerHTML = "";
        resultater.forEach(opskrift => addOpskriftToDOM(opskrift));

        return filtrereOpskrifter;
    });

    document.getElementById("filterKategori").addEventListener("change", function () {
        const valgtKategori = this.value;
        loadOpskrifter(valgtKategori);
    });

    function loadOpskrifter(filterKategori = "") {
        const savedOpskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
        opskrifterContainer.innerHTML = "";

        savedOpskrifter.forEach((opskrift, index) => {
            if (filterKategori === "" || opskrift.kategori === filterKategori) {
                addOpskriftToDOM(opskrift, index);
            }
        });
    }

    opskriftForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const titel = document.getElementById("titel").value;
        const ingredienser = document.getElementById("ingredienser").value;
        const fremgangsmade = document.getElementById("fremgangsmade").value;
        const kategori = document.getElementById("kategori").value; // Henter kategori

        if (titel && ingredienser && fremgangsmade && kategori) {
            const newOpskrift = { titel, ingredienser, fremgangsmade, kategori };
            const savedOpskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
            savedOpskrifter.push(newOpskrift);
            localStorage.setItem("opskrifter", JSON.stringify(savedOpskrifter));

            opskriftForm.reset();
            loadOpskrifter();
        }
    });


    // Tilføj kommentar til opskrift
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("comment-btn")) {
            const index = event.target.dataset.index;
            const commentInput = document.getElementById(`commentInput-${index}`);
            const commentText = commentInput.value;
            const kat = document.getElementById("kategori").value

            if (commentText) {
                const savedOpskrifter = JSON.parse(localStorage.getItem("opskrifter")) || [];
                if (!savedOpskrifter[index].comments) {
                    savedOpskrifter[index].comments = [];
                }
                savedOpskrifter[index].comments.push(commentText);
                localStorage.setItem("opskrifter", JSON.stringify(savedOpskrifter));

                // Opdater kommentarerne
                updateComments(savedOpskrifter[index].comments, index);
            }
        }
    });

    // Funktion der opdatere kommentarene
    function updateComments(comments, index) {
        const commentsList = document.getElementById(`comments-${index}`);
        if (commentsList) {
            commentsList.innerHTML = comments.map(comment => `<li>${comment}</li>`).join('');
        }
    }


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
            document.getElementById("kategori").value = opskrift.kategori;

            editingIndex = index; // Gem indeks for redigering
            document.getElementById("submitBtn").textContent = "Gem ændringer"; // Opdater knaptekst
        }
    });

    loadOpskrifter();
});


