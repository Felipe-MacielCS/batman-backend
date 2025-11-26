const API_URL = "/api/characters";

const tableBody = document.querySelector("#characters-table tbody");

const form = document.getElementById("character-form");
const nameInput = document.getElementById("name");
const realNameInput = document.getElementById("real_name");
const firstAppearanceInput = document.getElementById("first_appearance");
const createdByInput = document.getElementById("created_by");
const skillsInput = document.getElementById("skills");
const isVillainInput = document.getElementById("isVillain");
const isAntiHeroInput = document.getElementById("isAntiHero");

async function loadCharacters() {
  const res = await fetch(API_URL);
  const data = await res.json();
  tableBody.innerHTML = "";

  data.forEach((ch) => {
    const tr = document.createElement("tr");
    tr.dataset.id = ch.character_id;

    tr.innerHTML = `
      <td>${ch.character_id}</td>
      <td>${ch.name}</td>
      <td>${ch.real_name}</td>
      <td>${ch.first_appearance || ""}</td>
      <td>${ch.created_by}</td>
      <td>${ch.skills}</td>
      <td>${ch.isVillain ? "Yes" : "No"}</td>
      <td>${ch.isAntiHero ? "Yes" : "No"}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function makeRowEditable(tr) {
  const cells = tr.querySelectorAll("td");

  const [
    idCell,
    nameCell,
    realNameCell,
    firstCell,
    createdByCell,
    skillsCell,
    villainCell,
    antiHeroCell,
    actionCell,
  ] = cells;

  nameCell.innerHTML = `<input type="text" value="${nameCell.textContent}">`;
  realNameCell.innerHTML = `<input type="text" value="${realNameCell.textContent}">`;
  firstCell.innerHTML = `<input type="text" value="${firstCell.textContent}">`;
  createdByCell.innerHTML = `<input type="text" value="${createdByCell.textContent}">`;
  skillsCell.innerHTML = `<input type="text" value="${skillsCell.textContent}">`;

  villainCell.innerHTML = `<input type="checkbox" ${villainCell.textContent === "Yes" ? "checked" : ""}>`;
  antiHeroCell.innerHTML = `<input type="checkbox" ${antiHeroCell.textContent === "Yes" ? "checked" : ""}>`;

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
    real_name: inputs[1].value,
    first_appearance: inputs[2].value,
    created_by: inputs[3].value,
    skills: inputs[4].value,
    isVillain: inputs[5].checked,
    isAntiHero: inputs[6].checked,
  };

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  loadCharacters();
}

async function deleteCharacter(id) {
  if (!confirm("Delete this character?")) return;
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  loadCharacters();
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
    loadCharacters();
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteCharacter(id);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    name: nameInput.value,
    real_name: realNameInput.value,
    first_appearance: firstAppearanceInput.value,
    created_by: createdByInput.value,
    skills: skillsInput.value,
    isVillain: isVillainInput.checked,
    isAntiHero: isAntiHeroInput.checked,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  form.reset();
  loadCharacters();
});

loadCharacters();
