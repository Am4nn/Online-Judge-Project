const { validationResult } = require('express-validator');


const testController = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    return res.status(200).json({ "result": "success" });
}

module.exports = { testController };