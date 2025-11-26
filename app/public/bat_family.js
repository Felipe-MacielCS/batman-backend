const CHAR_API = "/api/characters";
const BATFAMILY_API = "/api/bat_family";

const tableBody = document.querySelector("#batfamily-table tbody");
const form = document.getElementById("batfamily-form");
const characterSelect = document.getElementById("character_id");
const relationshipInput = document.getElementById("relationship");

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

async function loadBatFamily() {
    const res = await fetch(BATFAMILY_API);
    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.dataset.id = item.bat_family_id;

        tr.innerHTML = `
            <td>${item.bat_family_id}</td>
            <td>${item.Character ? item.Character.name : "Unknown"}</td>
            <td>${item.relationship}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn" data-id="${item.bat_family_id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function makeRowEditable(tr) {
    const cells = tr.querySelectorAll("td");
    const [idCell, nameCell, relationshipCell, actionCell] = cells;

    // Cannot change Character — only relationship
    relationshipCell.innerHTML = `
        <input type="text" value="${relationshipCell.textContent}">
    `;

    actionCell.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
}

async function saveRow(tr) {
    const id = tr.dataset.id;
    const inputs = tr.querySelectorAll("input");

    const body = {
        relationship: inputs[0].value
    };

    await fetch(`${BATFAMILY_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadBatFamily();
}


async function deleteBatFamily(id) {
    if (!confirm("Delete this Bat Family entry?")) return;

    await fetch(`${BATFAMILY_API}/${id}`, { method: "DELETE" });
    loadBatFamily();
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
        loadBatFamily();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteBatFamily(id);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        character_id: characterSelect.value,
        relationship: relationshipInput.value
    };

    await fetch(BATFAMILY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadBatFamily();
});

loadCharacters();
loadBatFamily();
