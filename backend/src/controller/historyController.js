const historyService = require("../service/history.service");

const getHistory = async (req, res) => {

    try {

        const history =
            await historyService.getHistory(
                req.user.id
            );

        res.status(200).json({
            success: true,
            history
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getHistoryByType = async (
    req,
    res
) => {

    try {

        const { type } = req.params;

        const history =
            await historyService.getHistoryByType(
                req.user.id,
                type
            );

        res.status(200).json({
            success: true,
            history
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const deleteHistory = async (
    req,
    res
) => {

    try {

        const deleted =
        await historyService.deleteHistory(
            req.params.id,
            req.user.id
        );

        if (!deleted) {

            return res.status(404).json({
                success: false,
                message: "History not found"
            });

        }

        res.status(200).json({
            success: true,
            message:
            "History deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getHistory,
    getHistoryByType,
    deleteHistory
};