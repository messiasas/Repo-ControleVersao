import Log from "../models/Logs.js"

export const createLog = async (userId, action, recordId) => {
    await Log.create({
        user_id: userId,
        action,
        record_id: recordId
    });
};