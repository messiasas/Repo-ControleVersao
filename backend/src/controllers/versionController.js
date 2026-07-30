import * as service from "../services/versionServices.js";
import * as versionRepo from "../repositories/versionRepository.js";
import { buildVersionExcel } from "../services/excelExportService.js";
import { buildVersionPdf } from "../services/pdfExportService.js";

export const getAll = async(req, res) => {
    console.log("QUERY RECEBIDA:", req.query);
    try {
        const { page = 1, limit, sort, order, search, ...filters } = req.query;

        const result = await service.getAll({
            page: Number(page),
            limit: limit ? Number(limit) : null,
            sort, order, search, filters }); // O filter passa tudo de forma dinamica

        return res.json(result);
    }catch (error){
        return res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    const data = await service.create(req.body, req.user.id);
    res.status(201).json(data);
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await service.update(id, req.body, req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await service.remove(id, req.user.id);
        res.json({ message: "Pacote excluído com sucesso." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const exportExcel = async (req, res) => {
    try {
        const { id } = req.params;
        const version = await versionRepo.findById(id);
        if (!version) {
            return res.status(404).json({ message: "Pacote não encontrado." });
        }

        const workbook = await buildVersionExcel(version.toJSON());

        const nomeArquivo = `pacote_${version.empresa || "sem_empresa"}_${version.equipamento || "sem_equipamento"}`
            .replace(/[^a-zA-Z0-9_-]+/g, "_");

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${nomeArquivo}.xlsx"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const exportPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const version = await versionRepo.findById(id);
        if (!version) {
            return res.status(404).json({ message: "Pacote não encontrado." });
        }

        const pdfBuffer = await buildVersionPdf(version.toJSON());

        const nomeArquivo = `pacote_${version.empresa || "sem_empresa"}_${version.equipamento || "sem_equipamento"}`
            .replace(/[^a-zA-Z0-9_-]+/g, "_");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${nomeArquivo}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDistinctChaves = async (req, res) => {
    try {
        const chaves = await service.getDistinctChaves();
        res.json(chaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDistinctPlataformas = async (req, res) => {
    try {
        const plataformas = await service.getDistinctPlataformas();
        res.json(plataformas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};