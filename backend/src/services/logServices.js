import Log from "../models/Logs.js"

export const createLog = async (userId, action, recordId, details = null) => {
    await Log.create({
        user_id: userId,
        action,
        record_id: recordId,
        details: details ? JSON.stringify(details) : null,
    });
};