const History = require("../models/history.model");

const saveHistory = async ({
    user,
    type,
    data
}) => {

    return await History.create({
        user,
        type,
        data
    });

};

const getHistory = async (userId) => {

    return await History
        .find({ user: userId })
        .sort({ createdAt: -1 });

};

const getHistoryByType = async (
    userId,
    type
) => {

    return await History
        .find({
            user: userId,
            type
        })
        .sort({ createdAt: -1 });

};

const deleteHistory = async (
    historyId,
    userId
) => {

    return await History.findOneAndDelete({
        _id: historyId,
        user: userId
    });

};

module.exports = {
    saveHistory,
    getHistory,
    getHistoryByType,
    deleteHistory
};