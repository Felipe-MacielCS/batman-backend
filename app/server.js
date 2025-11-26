const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 

app.use("/api/characters", require("./routes/characters.routes"));
app.use("/api/bat_family", require("./routes/bat_family.routes"));
app.use("/api/supporting", require("./routes/supporting.routes"));
app.use("/api/aliases", require("./routes/aliases.routes"));
app.use("/api/teams", require("./routes/teams.routes"));
app.use("/api/character_teams", require("./routes/character_teams.routes"));
app.use("/api/places", require("./routes/places.routes"));
app.use("/api/character_places", require("./routes/character_places.routes"));
app.use("/api/medias", require("./routes/medias.routes"));
app.use("/api/character_medias", require("./routes/character_medias.routes"));
app.use("/api/bat_weapons", require("./routes/bat_weapons.routes"));
app.use("/api/character_bat_weapons", require("./routes/character_bat_weapons.routes"));
app.use("/api/bat_equipments", require("./routes/bat_equipments.routes"));
app.use("/api/character_bat_equipments", require("./routes/character_bat_equipments.routes"));
app.use("/api/bat_vehicles", require("./routes/bat_vehicles.routes"));
app.use("/api/character_bat_vehicles", require("./routes/character_bat_vehicles.routes"));

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("DB error:", err);
  }
});
