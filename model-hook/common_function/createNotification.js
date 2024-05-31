// const Notification = require("../Models/Notification")

// async function createNotification(title, mainEventId, message, receiverId, senderId) {
//     const createNotification = await Notification.create({
//         title,
//         message,
//         receiverId: receiverId || null,
//         senderId,
//         read: false
//     })
// }

// module.exports = createNotification;

const Notification = require("../Model/notificationModel")
exports.createNotification = async (userId, type, subType, title, message, data = {}) => {
    try {
        const newNotification = new Notification({
            userId,
            type,
            subType,
            title,
            message,
            data
        });
        await newNotification.save();
        console.log('Notification created');
    } catch (error) {
        console.error('Error adding notification:', error);
    }
};