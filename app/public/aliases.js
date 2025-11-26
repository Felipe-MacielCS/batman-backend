const CHAR_API = "/api/characters";
const ALIASES_API = "/api/aliases";

const tableBody = document.querySelector("#aliases-table tbody");
const form = document.getElementById("aliases-form");
const characterSelect = document.getElementById("character_id");
const aliasNameInput = document.getElementById("alias_name");

async function loadCharacters() {
    const res = await fetch(CHAR_API);
    const data = await res.json();

    characterSelect.innerHTML = "";

    data.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.character_id;
        opt.textContent = `${c.name} (${c.real_name})`;
        characterSelect.appendChild(opt);
    });
}

async function loadAliases() {
    const res = await fetch(ALIASES_API);
    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.dataset.id = item.alias_id;

        tr.innerHTML = `
            <td>${item.alias_id}</td>
            <td>${item.Character ? item.Character.name : "Unknown"}</td>
            <td>${item.alias_name}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn" data-id="${item.alias_id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function makeRowEditable(tr) {
    const cells = tr.querySelectorAll("td");
    const [idCell, charCell, aliasCell, actionCell] = cells;

    aliasCell.innerHTML = `<input type="text" value="${aliasCell.textContent}">`;

    actionCell.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
}

async function saveRow(tr) {
    const id = tr.dataset.id;
    const inputs = tr.querySelectorAll("input");

    const body = {
        alias_name: inputs[0].value
    };

    await fetch(`${ALIASES_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadAliases();
}

async function deleteAlias(id) {
    if (!confirm("Delete this alias?")) return;

    await fetch(`${ALIASES_API}/${id}`, { method: "DELETE" });
    loadAliases();
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
        loadAliases();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteAlias(id);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        character_id: characterSelect.value,
        alias_name: aliasNameInput.value
    };

    await fetch(ALIASES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadAliases();
});

loadCharacters();
loadAliases();
