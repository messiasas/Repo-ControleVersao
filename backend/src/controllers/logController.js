import { Log, VersionControl, User } from "../models/index.js";
import { Op, fn, col } from "sequelize";

export const getPackagesWithHistory = async (req, res) => {
  try {
    // Pega o log mais recente de cada record_id
    const latestRaw = await Log.findAll({
      attributes: ["record_id", [fn("MAX", col("id")), "max_id"]],
      group: ["record_id"],
      raw: true,
    });

    if (latestRaw.length === 0) return res.json([]);

    const maxIds = latestRaw.map((l) => l.max_id);

    const latestLogs = await Log.findAll({
      where: { id: { [Op.in]: maxIds } },
      include: [{ model: User, as: "user", attributes: ["email"] }],
      order: [["createdAt", "DESC"]],
    });

    const recordIds = latestLogs.map((l) => l.record_id);

    const existing = await VersionControl.findAll({
      where: { id: { [Op.in]: recordIds } },
      attributes: ["id", "pacote", "equipamento"],
    });
    const existingMap = new Map(existing.map((p) => [p.id, p]));

    const result = latestLogs.map((log) => {
      const pkg = existingMap.get(log.record_id);
      let pacote = pkg?.pacote;
      let equipamento = pkg?.equipamento;

      if (!pkg && log.details) {
        try {
          const details = JSON.parse(log.details);
          // "empresa" é o nome antigo do campo, mantido aqui só para logs
          // gravados antes da renomeação para "pacote" continuarem legíveis.
          pacote = details.pacote ?? details.empresa;
          equipamento = details.equipamento;
        } catch (_) {}
      }

      return {
        id: log.record_id,
        pacote: pacote || "—",
        equipamento: equipamento || "—",
        updatedAt: log.createdAt,
        lastEditor: log.user?.email || "—",
        deleted: !pkg,
      };
    });

    res.json(result);
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
