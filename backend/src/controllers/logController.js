import { Log, VersionControl, User } from "../models/index.js";
import { Op } from "sequelize";

export const getPackagesWithHistory = async (req, res) => {
  try {
    const logEntries = await Log.findAll({
      attributes: ["record_id"],
      group: ["record_id"],
      raw: true,
    });

    const ids = logEntries.map((l) => l.record_id);
    if (ids.length === 0) return res.json([]);

    const packages = await VersionControl.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: ["id", "empresa", "equipamento", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVersionHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await Log.findAll({
      where: { record_id: id },
      include: [{ model: User, as: "user", attributes: ["email"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
