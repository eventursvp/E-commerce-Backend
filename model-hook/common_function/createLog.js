const ApplicationLog = require("../Model/applicationLogsModel")

exports.createApplicationLog = async (module, activityName, preValue, nextValue, userId) => {
    try {
        const createApplicationLog = await ApplicationLog.create({
            module: module || "",
            activityName: activityName || "",
            preValue: preValue || {},
            nextValue: nextValue || {},
            userId: userId || ""
        })
        if (createApplicationLog) {
            console.log("logs created......")
        }
        else {
            console.log("logs not created.....")
        }
    } catch (error) {
        console.log('error =>', error);
    }
}