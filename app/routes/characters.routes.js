const express = require("express");
const router = express.Router();

const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
  try {
    const chars = await Characters.findAll();
    res.json(chars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching characters" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const char = await Characters.findByPk(req.params.id);
    if (!char) return res.status(404).json({ error: "Not found" });
    res.json(char);
  } catch (err) {
    res.status(500).json({ error: "Error fetching character" });
  }
});

router.post("/", async (req, res) => {
  try {
    const char = await Characters.create(req.body);
    res.status(201).json(char);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creating character" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const char = await Characters.findByPk(req.params.id);
    if (!char) return res.status(404).json({ error: "Not found" });

    await char.update(req.body);
    res.json(char);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error updating character" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const char = await Characters.findByPk(req.params.id);
    if (!char) return res.status(404).json({ error: "Not found" });

    await char.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error deleting character" });
  }
});

module.exports = router;
