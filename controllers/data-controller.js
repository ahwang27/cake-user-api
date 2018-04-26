var jwt = require('jsonwebtoken');
var { requestPromise, filterDateData } = require('../helper/helper-functions');

// GET ALL [/data]
const index = (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, async (err, authData) => {
        if (err) {
            res.json({ error: err.message });
        } else {
            let json = await requestPromise(process.env.DATA_API_URL);
            res.json(json);
        }
    })
}

// POST transactions by date 
// startDate and endDate format : "mm/dd/yyyy"
const getDayInformation = async (req, res) => {
    let json = await requestPromise(process.env.DATA_API_URL);
    let dayInfo = filterDateData(new Date(req.body.startDate), new Date(req.body.endDate), json);
    res.json(dayInfo);
}

const getImpressions = async (req, res) => {
    let json = await requestPromise(process.env.DATA_API_URL_IMPRESSION);
    let dayInfo = filterDateData(new Date(req.body.startDate), new Date(req.body.endDate), json);
    res.json(dayInfo);
}




module.exports = { index, getDayInformation, getImpressions}
