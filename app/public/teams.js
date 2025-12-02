const TEAMS_API = "/api/teams";
const CHAR_API = "/api/characters";
const TEAMCHAR_API = "/api/character_teams";

const tableBody = document.querySelector("#teams-table tbody");

const form = document.getElementById("team-form");
const nameInput = document.getElementById("team_name");
const descInput = document.getElementById("team_description");

const assignForm = document.getElementById("assign-form");
const teamSelect = document.getElementById("team_id");
const characterSelect = document.getElementById("character_id");


async function loadTeams() {
    const res = await fetch(TEAMS_API);
    const teams = await res.json();

    tableBody.innerHTML = "";

    for (const team of teams) {
        
        const charsRes = await fetch(`${TEAMCHAR_API}/team/${team.team_id}`);
        const charList = await charsRes.json();

        const charactersText = charList.length
            ? charList.map(c => c.Character.name).join(", ")
            : "<i>No members</i>";

        const tr = document.createElement("tr");
        tr.dataset.id = team.team_id;

        tr.innerHTML = `
            <td>${team.team_id}</td>
            <td>${team.name}</td>
            <td>${team.description || ""}</td>
            <td>${charactersText}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    loadTeamDropdown();
}

async function makeRowEditable(tr) {
    const id = tr.dataset.id;
    const cells = tr.querySelectorAll("td");
    const [idCell, nameCell, descCell, charCell, actionCell] = cells;

    nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
    descCell.innerHTML = `<input type="text" value="${descCell.textContent}">`;

    const allCharsRes = await fetch(CHAR_API);
    const allCharacters = await allCharsRes.json();

    const teamCharsRes = await fetch(`${TEAMCHAR_API}/team/${id}`);
    const teamCharacters = await teamCharsRes.json();

    const currentIDs = new Set(teamCharacters.map(c => c.character_id));

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

    const teamCharsRes = await fetch(`${TEAMCHAR_API}/team/${id}`);
    const teamCharacters = await teamCharsRes.json();
    const currentIDs = new Set(teamCharacters.map(c => c.character_id));

    const toAdd = selected.filter(id => !currentIDs.has(id));
    const toRemove = [...currentIDs].filter(id => !selected.includes(id));

    const body = {
        name: inputs[0].value,
        description: inputs[1].value
    };

    await fetch(`${TEAMS_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    for (const charID of toAdd) {
        await fetch(TEAMCHAR_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                team_id: id,
                character_id: charID
            })
        });
    }

    for (const charID of toRemove) {
        await fetch(`${TEAMCHAR_API}/${id}/${charID}`, {
            method: "DELETE"
        });
    }

    loadTeams();
}

async function deleteTeam(id) {
    if (!confirm("Delete this team?")) return;

    await fetch(`${TEAMS_API}/${id}`, { method: "DELETE" });

    loadTeams();
    loadTeamDropdown();
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
        loadTeams();
    }

    if (e.target.classList.contains("delete-btn")) {
        deleteTeam(id);
    }
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        name: nameInput.value,
        description: descInput.value
    };

    await fetch(TEAMS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    form.reset();
    loadTeams();
});

async function loadTeamDropdown() {
    const res = await fetch(TEAMS_API);
    const teams = await res.json();

    teamSelect.innerHTML = "";

    teams.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.team_id;
        opt.textContent = t.name;
        teamSelect.appendChild(opt);
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
        team_id: teamSelect.value,
        character_id: characterSelect.value
    };

    await fetch(TEAMCHAR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    loadTeams();
});

loadTeams();
loadCharacters();
