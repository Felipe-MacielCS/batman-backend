const BAT_EQUIPMENTS_API = "/api/bat_equipments";
const CHAR_API = "/api/characters";
const BAT_EQUIPMENTSCHAR_API = "/api/character_bat_equipments";

const tableBody = document.querySelector("#bat_equipments-table tbody");

const form = document.getElementById("bat_equipment-form");
const nameInput = document.getElementById("name");
const purposeInput = document.getElementById("purpose");
const typeInput = document.getElementById("type");

const assignForm = document.getElementById("assign-form");
const bat_equipmentSelect = document.getElementById("bat_equipment_id");
const characterSelect = document.getElementById("character_id");


async function loadEquipments() {
    const res = await fetch(BAT_EQUIPMENTS_API);
    const bat_equipments = await res.json();

    tableBody.innerHTML = "";

    for (const bat_equipment of bat_equipments) {
        
        const charsRes = await fetch(`${BAT_EQUIPMENTSCHAR_API}/bat_equipment/${bat_equipment.bat_equipment_id}`);
        const charList = await charsRes.json();

        const charactersText = charList.length
            ? charList.map(c => c.Character.name).join(", ")
            : "<i>No members</i>";

        const tr = document.createElement("tr");
        tr.dataset.id = bat_equipment.bat_equipment_id;

        tr.innerHTML = `
            <td>${bat_equipment.bat_equipment_id}</td>
            <td>${bat_equipment.name}</td>
            <td>${bat_equipment.purpose}</td>
            <td>${bat_equipment.type}</td>
            <td>${charactersText}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    loadBat_EquipmentDropdown();
}

async function makeRowEditable(tr) {
    const id = tr.dataset.id;
    const cells = tr.querySelectorAll("td");

    const [
        idCell,
        nameCell,
        purposeCell,
        typeCell,
        charCell,
        actionCell
    ] = cells;

    nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
    purposeCell.innerHTML = `<input type="text" value="${purposeCell.textContent}">`;
    typeCell.innerHTML = `<input type="text" value="${typeCell.textContent}">`;

    const allCharsRes = await fetch(CHAR_API);
    const allCharacters = await allCharsRes.json();

    const equipCharsRes = await fetch(`${BAT_EQUIPMENTSCHAR_API}/bat_equipment/${id}`);
    const equipCharacters = await equipCharsRes.json();

    const currentIDs = new Set(equipCharacters.map(c => c.character_id));

    let html = `<div class="char-checkboxes">`;

    allCharacters.forEach(c => {
        const checked = currentIDs.has(c.character_id) ? "checked" : "";
        html += `
            <label>
                <input type="checkbox" value="${c.character_id}" ${checked}>
                ${c.name}
            </label><br>
        `;
    });

    html += `</div>`;

    charCell.innerHTML = html;

    actionCell.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
}

async function saveRow(tr) {
    const id = tr.dataset.id;
    const inputs = tr.querySelectorAll("input[type='text']");
    const checkboxes = tr.querySelectorAll(".char-checkboxes input[type='checkbox']");

    const selected = [];
    checkboxes.forEach(cb => {
        if (cb.checked) selected.push(Number(cb.value));
    });

    const equipCharsRes = await fetch(`${BAT_EQUIPMENTSCHAR_API}/bat_equipment/${id}`);
    const equipCharacters = await equipCharsRes.json();
    const currentIDs = new Set(equipCharacters.map(c => c.character_id));

    const toAdd = selected.filter(cid => !currentIDs.has(cid));
    const toRemove = [...currentIDs].filter(cid => !selected.includes(cid));

    const body = {
        name: inputs[0].value,
        purpose: inputs[1].value,
        type: inputs[2].value,
    };

    await fetch(`${BAT_EQUIPMENTS_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    for (const charID of toAdd) {
        await fetch(BAT_EQUIPMENTSCHAR_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bat_equipment_id: id,
                character_id: charID
            })
        });
    }

    for (const charID of toRemove) {
        await fetch(`${BAT_EQUIPMENTSCHAR_API}/${id}/${charID}`, {
            method: "DELETE"
        });
    }

    loadEquipments();
}



async function deleteBat_Equipment(id) {
    if (!confirm("Delete this bat_equipment?")) return;

    await fetch(`${BAT_EQUIPMENTS_API}/${id}`, { method: "DELETE" });

    loadEquipments();
    loadBat_EquipmentDropdown();
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
        loadEquipments();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteBat_Equipment(id);
    }
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        name: nameInput.value,
        purpose: purposeInput.value,
        type: typeInput.value,
    };


    await fetch(BAT_EQUIPMENTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadEquipments();
});

async function loadBat_EquipmentDropdown() {
    const res = await fetch(BAT_EQUIPMENTS_API);
    const bat_equipments = await res.json();

    bat_equipmentSelect.innerHTML = "";

    bat_equipments.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.bat_equipment_id;
        opt.textContent = t.name;
        bat_equipmentSelect.appendChild(opt);
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
        bat_equipment_id: bat_equipmentSelect.value,
        character_id: characterSelect.value
    };

    await fetch(BAT_EQUIPMENTSCHAR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadEquipments();
});

loadEquipments();
loadCharacters();
