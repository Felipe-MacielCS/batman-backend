const MEDIAS_API = "/api/medias";
const CHAR_API = "/api/characters";
const MEDIASCHAR_API = "/api/character_medias";

const tableBody = document.querySelector("#medias-table tbody");

const form = document.getElementById("media-form");
const titleInput = document.getElementById("title");
const typeInput = document.getElementById("type");
const release_yearInput = document.getElementById("release_year");
const creatorInput = document.getElementById("creator");
const descriptionInput = document.getElementById("description");

const assignForm = document.getElementById("assign-form");
const mediaSelect = document.getElementById("media_id");
const characterSelect = document.getElementById("character_id");


async function loadMedias() {
    const res = await fetch(MEDIAS_API);
    const medias = await res.json();

    tableBody.innerHTML = "";

    for (const media of medias) {
        const charsRes = await fetch(`${MEDIASCHAR_API}/media/${media.media_id}`);
        const charList = await charsRes.json();

        const charactersText = charList.length
            ? charList.map(c => c.Character.name).join(", ")
            : "<i>No members</i>";

        const tr = document.createElement("tr");
        tr.dataset.id = media.media_id;

        tr.innerHTML = `
            <td>${media.media_id}</td>
            <td>${media.title}</td>
            <td>${media.type}</td>
            <td>${media.release_year}</td>
            <td>${media.creator}</td>
            <td>${media.description}</td>
            <td>${charactersText}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    loadMediaDropdown();
}

function makeRowEditable(tr) {
    const cells = tr.querySelectorAll("td");

    const [
        idCell,
        titleCell,
        typeCell,
        releaseCell,
        creatorCell,
        descCell,
        charCell,
        actionCell
    ] = cells;

    titleCell.innerHTML = `<input type="text" value="${titleCell.textContent}">`;
    typeCell.innerHTML = `<input type="text" value="${typeCell.textContent}">`;
    releaseCell.innerHTML = `<input type="text" value="${releaseCell.textContent}">`;
    creatorCell.innerHTML = `<input type="text" value="${creatorCell.textContent}">`;
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
        title: inputs[0].value,
        type: inputs[1].value,
        release_year: inputs[2].value,
        creator: inputs[3].value,
        description: inputs[4].value
    };

    await fetch(`${MEDIAS_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadMedias();
}

async function deleteMedia(id) {
    if (!confirm("Delete this media?")) return;

    await fetch(`${MEDIAS_API}/${id}`, { method: "DELETE" });

    loadMedias();
    loadMediaDropdown();
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
        loadMedias();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteMedia(id);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        title: titleInput.value,
        type: typeInput.value,
        release_year: release_yearInput.value,
        creator: creatorInput.value,
        description: descriptionInput.value
    };

    await fetch(MEDIAS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadMedias();
});

async function loadMediaDropdown() {
    const res = await fetch(MEDIAS_API);
    const medias = await res.json();

    mediaSelect.innerHTML = "";

    medias.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.media_id;
        opt.textContent = t.title;
        mediaSelect.appendChild(opt);
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
        media_id: mediaSelect.value,
        character_id: characterSelect.value
    };

    await fetch(MEDIASCHAR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadMedias();
});

loadMedias();
loadCharacters();
