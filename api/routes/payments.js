    const express = require('express');
    const router = express.Router();
    const mongoose = require('mongoose');
    const Payment = require("../models/payment")



// Getting all payments (only for admin)
router.get('/safetynet@safe123', (req, res, next) => {
    Payment.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            payments: docs.map(doc => {
                return {
                    _id: doc.id,
                    username: doc.username,
                    email: doc.email,
                    amount: doc.amount,
                    ref: doc.ref,
                    date: doc.date,
                    account: doc.account,
                    request: {
                            type: 'GET',
                            url: "http://89.40.11.242:8000/payments/safetynet@safe123/"+doc._id
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

// Getting client payments for summary 
router.get('/safetynet@safe123/summary/user/:Email', (req, res, next) => {
    const _email = req.params.Email;
    Payment.find({
        email: _email
    })
    .exec()
    .then(docs => {
        var totalpayments = 0;
        for(i = 0; i < docs.length; i++){
            totalpayments += docs[i].amount;
        }
        const response = {
            cashreceived: totalpayments
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
// Getting admin payments for summary 
router.get('/safetynet@safe123/summary/admin', (req, res, next) => {
    Payment.find()
    .exec()
    .then(docs => {
        var totalpayments = 0;
        for(i = 0; i < docs.length; i++){
            totalpayments += docs[i].amount;
        }
        const response = {
            cashreceived: totalpayments
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

//Get individual payment
router.get('/safetynet@safe123/:paymentID', (req, res, next) => {
    const id = req.params.paymentID;
    Payment.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                payment: doc,
                request: {
                    type: 'GET ALL',
                    url: 'http://89.40.11.242:8000/payments/safetynet@safe123'
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

//edit payments (for admin and user)
router.patch("/safetynet@safe123/:paymentId", (req, res, next) => {
    const id = req.params.paymentId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Payment.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Payment updated',
            request: {type: 'GET', url: "http://89.40.11.242:8000/payments/safetynet@safe123/"+id}
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
 });

 router.post('/safetynet@safe123', (req, res, next) => {
    const payment = new Payment({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        amount: req.body.amount,
        account: req.body.account,
        ref: req.body.ref,
        date: req.body.date
    });
    payment
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Create payment successfully',
            createdTrade : {
                _id: result.id,
                username: result.username,
                email: result.email,
                amount: result.amount,
                ref: result.ref,
                status: result.status,
                request: {
                  type: 'GET',
                  url: "http://89.40.11.242:8000/payments/safetynet@safe123/"+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//edit payments (for admin and user)
router.patch("/safetynet@safe123/:paymentId", (req, res, next) => {
    const id = req.params.paymentId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Payment.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Payment updated',
            request: {ref: 'GET', url: "http://89.40.11.242:8000/payments/safetynet@safe123/"+id}
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

//deleting payments(only admin)
router.delete('/safetynet@safe123/:paymentId', (req, res, next) => {
    const id = req.params.paymentId;
    Payment.remove({_id: id})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: "Payment Deleted"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;
