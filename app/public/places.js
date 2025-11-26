const PLACES_API = "/api/places";
const CHAR_API = "/api/characters";
const PLACESCHAR_API = "/api/character_places";

const tableBody = document.querySelector("#places-table tbody");

const form = document.getElementById("place-form");
const nameInput = document.getElementById("place_name");
const descInput = document.getElementById("place_description");

const assignForm = document.getElementById("assign-form");
const placeSelect = document.getElementById("place_id");
const characterSelect = document.getElementById("character_id");


async function loadPlaces() {
    const res = await fetch(PLACES_API);
    const places = await res.json();

    tableBody.innerHTML = "";

    for (const place of places) {
        
        const charsRes = await fetch(`${PLACESCHAR_API}/place/${place.place_id}`);
        const charList = await charsRes.json();

        const charactersText = charList.length
            ? charList.map(c => c.Character.name).join(", ")
            : "<i>No members</i>";

        const tr = document.createElement("tr");
        tr.dataset.id = place.place_id;

        tr.innerHTML = `
            <td>${place.place_id}</td>
            <td>${place.name}</td>
            <td>${place.description || ""}</td>
            <td>${charactersText}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    loadPlaceDropdown();
}

function makeRowEditable(tr) {
    const cells = tr.querySelectorAll("td");
    const [idCell, nameCell, descCell, charCell, actionCell] = cells;

    nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
    descCell.innerHTML = `<input type="text" value="${descCell.textContent}">`;

    actionCell.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
}


async function saveRow(tr) {
    const id = tr.dataset.id;
    const inputs = tr.querySelectorAll("input");

    const body = {
        name: inputs[0].value,
        description: inputs[1].value
    };

    await fetch(`${PLACES_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadPlaces();
}


async function deletePlace(id) {
    if (!confirm("Delete this place?")) return;

    await fetch(`${PLACES_API}/${id}`, { method: "DELETE" });

    loadPlaces();
    loadPlaceDropdown();
}


tableBody.addEventListener("click", (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return;

    const id = tr.dataset.id;

    if (e.target.classList.contains("edit-btn")) {
        makeRowEditable(tr);
    }

    if (e.target.classList.contains("save-btn")) {
        saveRow(tr);
    }

    if (e.target.classList.contains("cancel-btn")) {
        loadPlaces();
    }

    if (e.target.classList.contains("delete-btn")) {
        deletePlace(id);
    }
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        name: nameInput.value,
        description: descInput.value
    };

    await fetch(PLACES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadPlaces();
});

async function loadPlaceDropdown() {
    const res = await fetch(PLACES_API);
    const places = await res.json();

    placeSelect.innerHTML = "";

    places.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.place_id;
        opt.textContent = t.name;
        placeSelect.appendChild(opt);
    });
}


async function loadCharacters() {
    const res = await fetch(CHAR_API);
    const characters = await res.json();

    characterSelect.innerHTML = "";

    characters.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.character_id;
        opt.textContent = `${c.name} (${c.real_name})`;
        characterSelect.appendChild(opt);
    });
}

assignForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        place_id: placeSelect.value,
        character_id: characterSelect.value
    };

    await fetch(PLACESCHAR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadPlaces();
});

loadPlaces();
loadCharacters();
