const CHAR_API = "/api/characters";
const SUPPORTING_API = "/api/supporting";

const tableBody = document.querySelector("#supporting-table tbody");
const form = document.getElementById("supporting-form");
const characterSelect = document.getElementById("character_id");
const roleInput = document.getElementById("role");

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

async function loadSupporting() {
    const res = await fetch(SUPPORTING_API);
    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach(item => {
        const tr = document.createElement("tr");
        tr.dataset.id = item.supporting_id;

        tr.innerHTML = `
            <td>${item.supporting_id}</td>
            <td>${item.Character ? item.Character.name : "Unknown"}</td>
            <td>${item.role}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn" data-id="${item.supporting_id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function makeRowEditable(tr) {
    const cells = tr.querySelectorAll("td");
    const [idCell, nameCell, roleCell, actionCell] = cells;

    roleCell.innerHTML = `<input type="text" value="${roleCell.textContent}">`;

    actionCell.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
}

async function saveRow(tr) {
    const id = tr.dataset.id;
    const inputs = tr.querySelectorAll("input");

    const body = {
        role: inputs[0].value
    };

    await fetch(`${SUPPORTING_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadSupporting();
}

async function deleteSupporting(id) {
    if (!confirm("Delete this supporting character?")) return;

    await fetch(`${SUPPORTING_API}/${id}`, { method: "DELETE" });
    loadSupporting();
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
        loadSupporting();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteSupporting(id);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        character_id: characterSelect.value,
        role: roleInput.value
    };

    await fetch(SUPPORTING_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadSupporting();
});

loadCharacters();
loadSupporting();
