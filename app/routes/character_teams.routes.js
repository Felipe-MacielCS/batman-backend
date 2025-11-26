const express = require("express");
const router = express.Router();

const Character_Teams = require("../models/character_teams.model");
const Characters = require("../models/characters.model");
const Teams = require("../models/teams.model");

router.get("/", async (req, res) => {
    const items = await Character_Teams.findAll({
        include: [Characters, Teams]
    });

    res.json(items);
});

router.get("/team/:team_id", async (req, res) => {
    const rows = await Character_Teams.findAll({
        where: { team_id: req.params.team_id },
        include: [{ model: Characters }]
    });

    res.json(rows);
});

router.post("/", async (req, res) => {
    const { team_id, character_id } = req.body;

    const exists = await Character_Teams.findOne({
        where: { team_id, character_id }
    });

    if (exists) return res.status(400).json({ error: "Already assigned" });

    const item = await Character_Teams.create(req.body);
    res.json(item);
});

router.delete("/:team_id/:character_id", async (req, res) => {
    await Character_Teams.destroy({
        where: {
            team_id: req.params.team_id,
            character_id: req.params.character_id
        }
    });

    res.json({ message: "Character removed from team" });
});

module.exports = router;
