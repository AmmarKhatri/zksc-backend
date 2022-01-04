const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.status(200).json({version: "v.B100900"});
});

module.exports = router;
