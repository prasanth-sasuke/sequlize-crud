const { logger } = require("sequelize/lib/utils/logger");
const sequelize = require("../config/database.js");

module.exports.pageNation = async (req, res) => {
    try {
        let data = req.query;
        let limit = 100;

        if (!data || !data.page) {
            return res.status(400).json({ message: "Invalid field!" });
        }

        if (data.page < 1) {
            return res.status(400).json({ message: "Page must be positive numbers!" });
        }

        const offset = (data.page - 1) * limit;
        console.log(offset);
        
        let [countResult] = await sequelize.query(`SELECT COUNT(*) AS count FROM product`);
        let totalCount = countResult[0].count;

        let results = await sequelize.query(`SELECT * FROM product ORDER BY id LIMIT :limit OFFSET :offset`, {
            replacements: { limit, offset },
            type: sequelize.QueryTypes.SELECT,
        });

        return res.status(200).json({
            message: "Success",
            result: results,
            total: totalCount,
            currentPage: parseInt(data.page),
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

