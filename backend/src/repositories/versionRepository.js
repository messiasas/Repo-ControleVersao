import VersionControl from "../models/VersionControl.js";

export const create = (data) => VersionControl.create(data);

export const findAll = () => VersionControl.findAll();

export const findById = (id) => VersionControl.findByPk(id);

export const update = (id, data) => VersionControl.update(data, {where: {id} });

export const remove = (id) => VersionControl.destroy({where:{id}});