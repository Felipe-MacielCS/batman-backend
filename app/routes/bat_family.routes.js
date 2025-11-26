const express = require("express");
const router = express.Router();

const Bat_Family = require("../models/bat_family.model");

const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
  const list = await Bat_Family.findAll({
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
  const item = await Bat_Family.findByPk(req.params.id);
  res.json(item);
});

router.post("/", async (req, res) => {
  const newItem = await Bat_Family.create(req.body);
  res.json(newItem);
});

router.put("/:id", async (req, res) => {
  await Bat_Family.update(req.body, { where: { bat_family_id: req.params.id } });
  res.json({ message: "Updated" });
});

router.delete("/:id", async (req, res) => {
  await Bat_Family.destroy({ where: { bat_family_id: req.params.id } });
  res.json({ message: "Deleted" });
});

module.exports = router;
