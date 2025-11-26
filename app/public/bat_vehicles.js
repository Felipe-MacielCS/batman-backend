const BAT_VEHICLES_API = "/api/bat_vehicles";
const CHAR_API = "/api/characters";
const BAT_VEHICLESCHAR_API = "/api/character_bat_vehicles";

const tableBody = document.querySelector("#bat_vehicles-table tbody");

const form = document.getElementById("bat_vehicle-form");
const nameInput = document.getElementById("name");
const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");

const assignForm = document.getElementById("assign-form");
const bat_vehicleSelect = document.getElementById("bat_vehicle_id");
const characterSelect = document.getElementById("character_id");


async function loadVehicles() {
    const res = await fetch(BAT_VEHICLES_API);
    const bat_vehicles = await res.json();

    tableBody.innerHTML = "";

    for (const bat_vehicle of bat_vehicles) {
        
        const charsRes = await fetch(`${BAT_VEHICLESCHAR_API}/bat_vehicle/${bat_vehicle.bat_vehicle_id}`);
        const charList = await charsRes.json();

        const charactersText = charList.length
            ? charList.map(c => c.Character.name).join(", ")
            : "<i>No members</i>";

        const tr = document.createElement("tr");
        tr.dataset.id = bat_vehicle.bat_vehicle_id;

        tr.innerHTML = `
            <td>${bat_vehicle.bat_vehicle_id}</td>
            <td>${bat_vehicle.name}</td>
            <td>${bat_vehicle.type}</td>
            <td>${bat_vehicle.description}</td>
            <td>${charactersText}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    loadBat_VehicleDropdown();
}

function makeRowEditable(tr) {
    const cells = tr.querySelectorAll("td");
    const [idCell, nameCell, typeCell, descriptionCell, charCell, actionCell] = cells;

    nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
    typeCell.innerHTML = `<input type="text" value="${typeCell.textContent}">`;
    descriptionCell.innerHTML = `<input type="text" value="${descriptionCell.textContent}">`;

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
        type: inputs[1].value,
        description: inputs[2].value,
    };

    await fetch(`${BAT_VEHICLES_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadVehicles();
}


async function deleteBat_Vehicle(id) {
    if (!confirm("Delete this bat_vehicle?")) return;

    await fetch(`${BAT_VEHICLES_API}/${id}`, { method: "DELETE" });

    loadVehicles();
    loadBat_VehicleDropdown();
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
        loadVehicles();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteBat_Vehicle(id);
    }
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        name: nameInput.value,
        type: typeInput.value,
        description: descriptionInput.value,
    };


    await fetch(BAT_VEHICLES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadVehicles();
});

async function loadBat_VehicleDropdown() {
    const res = await fetch(BAT_VEHICLES_API);
    const bat_vehicles = await res.json();

    bat_vehicleSelect.innerHTML = "";

    bat_vehicles.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.bat_vehicle_id;
        opt.textContent = t.name;
        bat_vehicleSelect.appendChild(opt);
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
        bat_vehicle_id: bat_vehicleSelect.value,
        character_id: characterSelect.value
    };

    await fetch(BAT_VEHICLESCHAR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadVehicles();
});

loadVehicles();
loadCharacters();
