const express = require("express");
const router = express.Router();

const Supporting = require("../models/supporting.model");

const Characters = require("../models/characters.model");

router.get("/", async (req, res) => {
  const list = await Supporting.findAll({
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
  const item = await Supporting.findByPk(req.params.id);
  res.json(item);
});

router.post("/", async (req, res) => {
  const newItem = await Supporting.create(req.body);
  res.json(newItem);
});

router.put("/:id", async (req, res) => {
  await Supporting.update(req.body, { where: { supporting_id: req.params.id } });
  res.json({ message: "Updated" });
});

router.delete("/:id", async (req, res) => {
  await Supporting.destroy({ where: { supporting_id: req.params.id } });
  res.json({ message: "Deleted" });
});

module.exports = router;
