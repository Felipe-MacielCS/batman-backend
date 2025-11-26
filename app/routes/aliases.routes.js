const express = require("express");
const router = express.Router();

const Aliases = require("../models/aliases.model");

const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
  const list = await Aliases.findAll({
    include: [
      {
        model: Characters,
        attributes: ["character_id", "name", "real_name"]
      }
    ]
  });

  res.json(list);
});

router.get("/:id", async (req, res) => {
  const item = await Aliases.findByPk(req.params.id);
  res.json(item);
});

router.post("/", async (req, res) => {
  const newItem = await Aliases.create(req.body);
  res.json(newItem);
});

router.put("/:id", async (req, res) => {
  await Aliases.update(req.body, { where: { alias_id: req.params.id } });
  res.json({ message: "Updated" });
});

router.delete("/:id", async (req, res) => {
  await Aliases.destroy({ where: { alias_id: req.params.id } });
  res.json({ message: "Deleted" });
});

module.exports = router;
