const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Member = require('../models/member');

// Getting all members (only for admin)
router.get('/', (req, res, next) => {
    Member.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            members: docs.map(doc => {
                return {
                    _id: doc.id,
                    username: doc.username,
                    email: doc.email,
                    password: doc.password,
                    number: doc.number,
                    country: doc.country,
                    balance: doc.balance,
                    active: doc.active,
                    commrate:doc.commrate,
                    request: {
                            type: 'GET',
                            url: "http://89.40.11.242:8000/members/"+doc._id
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

//Admin can approve the requests
router.get('/approval/:Active', (req, res, next) => {
    const _active = req.params.Active;
    Member.find({active: _active})
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            members: docs.map(doc => {
                return {
                    _id: doc.id,
                    username: doc.username,
                    email: doc.email,
                    password: doc.password,
                    number: doc.number,
                    country: doc.country,
                    balance: doc.balance,
                    active: doc.active,
                    commrate: doc.commrate,
                    request: {
                            type: 'GET',
                            url: "http://89.40.11.242:8000/members/"+doc._id
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

//Admin can approve the requests
router.get('/admin/getbal', (req, res, next) => {
    Member.find()
    .exec()
    .then(docs => {
        var totalbal = 0;
        for(i = 0; docs.length > i; i++) {
            totalbal += docs[i].balance;
        }
        const response = {
            balance: totalbal
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



//login functionality

router.get('/login/:email/:pass', (req, res, next) => {
    const _email = req.params.email;
    const _pass = req.params.pass;
    Member.find({
        email: _email,
        password: _pass
    })
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc.length > 0) {
            res.status(200).json(doc[0]);
        }else{
            res.status(404).json({message: "Email ID or Password did not match"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//Get individual member
router.get('/:memberID', (req, res, next) => {
    const id = req.params.memberID;
    Member.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                member: doc,
                request: {
                    type: 'GET ALL',
                    url: 'http://89.40.11.242:8000/members'
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


//Creating members
router.post('/signup', (req, res, next) => {
    Member
    .find({email:req.body.email} || {username:req.body.username})
    .exec()
    .then(user =>{
        if(user.length >= 1){
            return res.status(409).json({
                message: "Member email or username already exists"
            });
        } else {
    const member = new Member({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    number: req.body.number,
    country: req.body.country,
    balance: req.body.balance,
    active: req.body.active,
    commrate:req.body.commrate
    });
    member
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message: 'Create member successfully',
            createdMember : {
                _id: result.id,
                username: result.username,
                email: result.email,
                password: result.password,
                number: result.number,
                country: result.country,
                balance: result.balance,
                active: result.active,
                commrate: result.commrate,
                request: {
                  type: 'GET',
                  url: "http://89.40.11.242:8000/members/"+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
        }
    });
    
}); 

//edit members (for admin and user)
router.patch("/:memberId", (req, res, next) => {
    const id = req.params.memberId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Member.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Member updated',
            request: {type: 'GET', url: "http://89.40.11.242:8000/members/"+id}
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
 });



//deleting member(only admin)
router.delete('/:memberId', (req, res, next) => {
    const id = req.params.memberId;
    Member.remove({_id: id})
    .exec()
    .then(result=> {
        res.status(200).json({
            message: "User Deleted"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;