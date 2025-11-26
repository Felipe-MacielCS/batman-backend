const BAT_WEAPONS_API = "/api/bat_weapons";
const CHAR_API = "/api/characters";
const BAT_WEAPONSCHAR_API = "/api/character_bat_weapons";

const tableBody = document.querySelector("#bat_weapons-table tbody");

const form = document.getElementById("bat_weapon-form");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const typeInput = document.getElementById("type");
const rangeInput = document.getElementById("range");

const assignForm = document.getElementById("assign-form");
const bat_weaponSelect = document.getElementById("bat_weapon_id");
const characterSelect = document.getElementById("character_id");


async function loadWeapons() {
    const res = await fetch(BAT_WEAPONS_API);
    const bat_weapons = await res.json();

    tableBody.innerHTML = "";

    for (const bat_weapon of bat_weapons) {
        
        const charsRes = await fetch(`${BAT_WEAPONSCHAR_API}/bat_weapon/${bat_weapon.bat_weapon_id}`);
        const charList = await charsRes.json();

        const charactersText = charList.length
            ? charList.map(c => c.Character.name).join(", ")
            : "<i>No members</i>";

        const tr = document.createElement("tr");
        tr.dataset.id = bat_weapon.bat_weapon_id;

        tr.innerHTML = `
            <td>${bat_weapon.bat_weapon_id}</td>
            <td>${bat_weapon.name}</td>
            <td>${bat_weapon.description}</td>
            <td>${bat_weapon.type}</td>
            <td>${bat_weapon.range}</td>
            <td>${charactersText}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    loadBat_WeaponDropdown();
}

function makeRowEditable(tr) {
    const cells = tr.querySelectorAll("td");
    const [idCell, nameCell, descCell, typeCell, rangeCell, charCell, actionCell] = cells;

    nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
    descCell.innerHTML = `<input type="text" value="${descCell.textContent}">`;
    typeCell.innerHTML = `<input type="text" value="${typeCell.textContent}">`;
    rangeCell.innerHTML = `<input type="text" value="${rangeCell.textContent}">`;

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
        description: inputs[1].value,
        type: inputs[2].value,
        range: inputs[3].value,
    };

    await fetch(`${BAT_WEAPONS_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadWeapons();
}


async function deleteBat_Weapon(id) {
    if (!confirm("Delete this bat_weapon?")) return;

    await fetch(`${BAT_WEAPONS_API}/${id}`, { method: "DELETE" });

    loadWeapons();
    loadBat_WeaponDropdown();
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
        loadWeapons();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteBat_Weapon(id);
    }
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        name: nameInput.value,
        description: descriptionInput.value,
        type: typeInput.value,
        range: rangeInput.value,
    };


    await fetch(BAT_WEAPONS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadWeapons();
});

async function loadBat_WeaponDropdown() {
    const res = await fetch(BAT_WEAPONS_API);
    const bat_weapons = await res.json();

    bat_weaponSelect.innerHTML = "";

    bat_weapons.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.bat_weapon_id;
        opt.textContent = t.name;
        bat_weaponSelect.appendChild(opt);
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
        bat_weapon_id: bat_weaponSelect.value,
        character_id: characterSelect.value
    };

    await fetch(BAT_WEAPONSCHAR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadWeapons();
});

loadWeapons();
loadCharacters();
