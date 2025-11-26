const express = require("express");
const router = express.Router();

const Teams = require("../models/teams.model");
const Character_Teams = require("../models/character_teams.model");
const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
    const list = await Teams.findAll();
    res.json(list);
});

router.get("/:id", async (req, res) => {
    const team = await Teams.findByPk(req.params.id);
    res.json(team);
});

router.post("/", async (req, res) => {
    try {
        const newTeam = await Teams.create(req.body);
        res.json(newTeam);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Error creating team" });
    }
});


router.put("/:id", async (req, res) => {
    await Teams.update(req.body, {
        where: { team_id: req.params.id }
    });
    res.json({ message: "Team updated" });
});

router.delete("/:id", async (req, res) => {
    await Character_Teams.destroy({ where: { team_id: req.params.id } }); // clear assignments
    await Teams.destroy({ where: { team_id: req.params.id } });

    res.json({ message: "Team deleted" });
});

module.exports = router;
