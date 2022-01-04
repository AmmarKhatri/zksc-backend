const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Trade = require('../models/trade');

router.get('/', (req, res, next) => {
        Trade.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                trades: docs.map(doc => {
                    return {
                        _id: doc.id,
                        username: doc.username,
                        email: doc.email,
                        divbon: doc.divbon,
                        scrip: doc.scrip,
                        buydate: doc.buydate,
                        qty: doc.qty,
                        buyrate: doc.buyrate,
                        buyamount: doc.buyamount,
                        soldpending: doc.soldpending,
                        saledate: doc.saledate,
                        salerate: doc.salerate,
                        saleamount: doc.saleamount,
                        commrate: doc.commrate,
                        cgtrate: doc.cgtrate,
                        pls: doc.pls,
                        netprofit: doc.netprofit,
                        commamount: doc.commamount,
                        status: doc.status,
                        request: {
                                type: 'GET',
                                url: "http://89.40.11.242:8000/trades/"+doc._id
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

// Sale call from Admin point
router.get('/scrip/:Scrip/:soldPend/:Approve', (req, res, next) => {
    const _scrip = req.params.Scrip;
    const _soldpend = req.params.soldPend;
    const _status = req.params.Approve;
    Trade.find({
        status: _status,
        scrip: _scrip,
        soldpending: _soldpend
    })
    .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                trades: docs.map(doc => {
                    return {
                        _id: doc.id,
                        username: doc.username,
                        email: doc.email,
                        divbon: doc.divbon,
                        scrip: doc.scrip,
                        buydate: doc.buydate,
                        qty: doc.qty,
                        buyrate: doc.buyrate,
                        buyamount: doc.buyamount,
                        soldpending: doc.soldpending,
                        saledate: doc.saledate,
                        salerate: doc.salerate,
                        saleamount: doc.saleamount,
                        commrate: doc.commrate,
                        cgtrate: doc.cgtrate,
                        pls: doc.pls,
                        netprofit: doc.netprofit,
                        commamount: doc.commamount,
                        status: doc.status,
                        url: "http://89.40.11.242:8000/trades/"+doc._id
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
// Sale call list from Admin point
router.get('/salecalllist', (req, res, next) => {
    Trade.find({
        status: "s",
        soldpending: "PENDING"
    })
    .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                trades: docs.map(doc => {
                    return {
                        _id: doc.id,
                        username: doc.username,
                        email: doc.email,
                        divbon: doc.divbon,
                        scrip: doc.scrip,
                        buydate: doc.buydate,
                        qty: doc.qty,
                        buyrate: doc.buyrate,
                        buyamount: doc.buyamount,
                        soldpending: doc.soldpending,
                        saledate: doc.saledate,
                        salerate: doc.salerate,
                        saleamount: doc.saleamount,
                        commrate: doc.commrate,
                        cgtrate: doc.cgtrate,
                        pls: doc.pls,
                        netprofit: doc.netprofit,
                        commamount: doc.commamount,
                        status: doc.status,
                        url: "http://89.40.11.242:8000/trades/"+doc._id
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

// Sale call list from client point
router.get('/salecalllist/:Email', (req, res, next) => {
    const _email = req.params.Email;
    Trade.find({
        email: _email,
        status: "s",
        soldpending: "PENDING"
    })
    .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                trades: docs.map(doc => {
                    return {
                        _id: doc.id,
                        username: doc.username,
                        email: doc.email,
                        divbon: doc.divbon,
                        scrip: doc.scrip,
                        buydate: doc.buydate,
                        qty: doc.qty,
                        buyrate: doc.buyrate,
                        buyamount: doc.buyamount,
                        soldpending: doc.soldpending,
                        saledate: doc.saledate,
                        salerate: doc.salerate,
                        saleamount: doc.saleamount,
                        commrate: doc.commrate,
                        cgtrate: doc.cgtrate,
                        pls: doc.pls,
                        netprofit: doc.netprofit,
                        commamount: doc.commamount,
                        status: doc.status,
                        url: "http://89.40.11.242:8000/trades/"+doc._id
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

router.get('/summary/user/PENDING/:Email', (req, res, next) => {
    const _email = req.params.Email;
    Trade.find({
        email: _email,
        soldpending: "PENDING"
    })
    .exec()
        .then(docs => {
            var totalbuyamt = 0;
            var _scrips = [];
            var check = [];
            
            for (var i = 0; i < docs.length; i++) {
              totalbuyamt = totalbuyamt + docs[i].buyamount;
              for(j = 0; _scrips.length > j; j++){
                    check.push(_scrips[j].Scrip);
              };
              if(check.includes(docs[i].scrip)){
                for(k = 0; _scrips.length > k; k++){
                    if(docs[i].scrip == _scrips[k].Scrip){
                        _scrips[k].Buyamount = _scrips[k].Buyamount + docs[i].buyamount; 
                        _scrips[k].Quantity = _scrips[k].Quantity + docs[i].qty;
                    }
                };
                check = [];
              }else{
                
                _scrips.push({ Scrip: docs[i].scrip , Quantity: docs[i].qty, Buyamount: docs[i].buyamount});
                  check = [];
              };

            };
            const response = {
                totalbuyamount: totalbuyamt,
                scrips: _scrips
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

router.get('/summary/user/S/:Email', (req, res, next) => {
    const _email = req.params.Email;
    Trade.find({
        email: _email,
        soldpending: "S"
    })
    .exec()
        .then(docs => {
            var totalsaleamt = 0;
            var totalcommamount = 0;
            var totalpls = 0;
            for (var i = 0; i < docs.length; i++) {
              totalsaleamt = totalsaleamt + docs[i].saleamount;
              totalcommamount = totalcommamount + docs[i].commamount;
              totalpls = totalpls + docs[i].pls;
            };
            const response = {
                totalsaleamount: totalsaleamt,
                totalcommissionamount: totalcommamount,
                totalpls : totalpls
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

router.get('/summary/admin/S', (req, res, next) => {
    Trade.find({
        soldpending: "S"
    })
    .exec()
        .then(docs => {
            var totalsaleamt = 0;
            var totalcommamount = 0;
            var totalpls = 0;
            for (var i = 0; i < docs.length; i++) {
              totalsaleamt = totalsaleamt + docs[i].saleamount;
              totalcommamount = totalcommamount + docs[i].commamount;
              totalpls = totalpls + docs[i].pls;
            };
            const response = {
                totalsaleamount: totalsaleamt,
                totalcommissionamount: totalcommamount,
                totalpls : totalpls
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


router.get('/user/trash/notneeded/route', (req, res, next) => {
    Trade.find({
        soldpending: "PENDING"
    })
    .exec()
        .then(docs => {
            var totalbuyamt = 0;
            var _scrips = [];
            var check = [];
            
            for (var i = 0; i < docs.length; i++) {
              totalbuyamt = totalbuyamt + docs[i].buyamount;
              for(j = 0; _scrips.length > j; j++){
                    check.push(_scrips[j].Scrip);
              };
              if(check.includes(docs[i].scrip)){
                for(k = 0; _scrips.length > k; k++){
                    if(docs[i].scrip == _scrips[k].Scrip){
                        _scrips[k].Buyamount = _scrips[k].Buyamount + docs[i].buyamount;
                        _scrips[k].Quantity = _scrips[k].Quantity + docs[i].qty;
                    }
                };
                check = [];
              }else{
                
                _scrips.push({ Scrip: docs[i].scrip , Quantity: docs[i].qty, Buyamount: docs[i].buyamount});
                  check = [];
              };

            };
            const response = {
                totalbuyamount: totalbuyamt,
                scrips: _scrips
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


router.get('/summary/admin/PENDING', (req, res, next) => {
    Trade.find({
        soldpending: "PENDING"
    })
    .exec()
        .then(docs => {
            var totalbuyamt = 0;
            var _scrips = [];
            
            for (var i = 0; i < docs.length; i++) {
              totalbuyamt = totalbuyamt + docs[i].buyamount;
              _scrips.push({Scrip: docs[i].scrip , Quantity: docs[i].qty, Buyamount: docs[i].buyamount, Commrate: docs[i].commrate});
            };
            const response = {
                totalbuyamount: totalbuyamt,
                scrips: _scrips
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


 // Admin checks off status
router.get('/admin/:SoldPend/:Status', (req, res, next) => {
    const _soldpend = req.params.SoldPend;
    const _status = req.params.Status;
    Trade.find({
        soldpending: _soldpend,
        status: _status,
    })
    .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                trades: docs.map(doc => {
                    return {
                        _id: doc.id,
                        username: doc.username,
                        email: doc.email,
                        divbon: doc.divbon,
                        scrip: doc.scrip,
                        buydate: doc.buydate,
                        qty: doc.qty,
                        buyrate: doc.buyrate,
                        buyamount: doc.buyamount,
                        soldpending: doc.soldpending,
                        saledate: doc.saledate,
                        salerate: doc.salerate,
                        saleamount: doc.saleamount,
                        commrate: doc.commrate,
                        cgtrate: doc.cgtrate,
                        pls: doc.pls,
                        netprofit: doc.netprofit,
                        commamount: doc.commamount,
                        status: doc.status,
                        url: "http://89.40.11.242:8000/trades/"+doc._id
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

router.get('/user/:soldPending/:Email', (req, res, next) => {
    const _email = req.params.Email;
    const _soldpend = req.params.soldPending;
    Trade.find({
        email: _email,
        soldpending: _soldpend
    })
    .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                trades: docs.map(doc => {
                    return {
                        _id: doc.id,
                        username: doc.username,
                        email: doc.email,
                        divbon: doc.divbon,
                        scrip: doc.scrip,
                        buydate: doc.buydate,
                        qty: doc.qty,
                        buyrate: doc.buyrate,
                        buyamount: doc.buyamount,
                        soldpending: doc.soldpending,
                        saledate: doc.saledate,
                        salerate: doc.salerate,
                        saleamount: doc.saleamount,
                        commrate: doc.commrate,
                        cgtrate: doc.cgtrate,
                        pls: doc.pls,
                        netprofit: doc.netprofit,
                        commamount: doc.commamount,
                        status: doc.status,
                        url: "http://89.40.11.242:8000/trades/"+doc._id
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

router.post('/', (req, res, next) => {
    const trade = new Trade({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        divbon: req.body.divbon,
        scrip: req.body.scrip,
        buydate: req.body.buydate,
        qty: req.body.qty,
        buyrate: req.body.buyrate,
        buyamount: req.body.buyamount,
        soldpending: req.body.soldpending,
        saledate: req.body.saledate,
        salerate: req.body.salerate,
        saleamount: req.body.saleamount,
        commrate: req.body.commrate,
        cgtrate: req.body.cgtrate,
        pls: req.body.pls,
        netprofit: req.body.netprofit,
        commamount: req.body.commamount,
        status: req.body.status
    });
    trade
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Create trade successfully',
            createdTrade : {
                _id: result.id,
                username: result.username,
                email: result.email,
                divbon: result.divbon,
                scrip: result.scrip,
                buydate: result.buydate,
                qty: result.qty,
                buyrate: result.buyrate,
                buyamount: result.buyamount,
                soldpending: result.soldpending,
                saledate: result.saledate,
                salerate: result.salerate,
                saleamount: result.saleamount,
                commrate: result.commrate,
                cgtrate: result.cgtrate,
                pls: result.pls,
                netprofit: result.netprofit,
                commamount: result.commamount,
                status: result.status,
                request: {
                  type: 'GET',
                  url: "http://89.40.11.242:8000/trades/"+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.get('/:tradeID', (req, res, next) => {
    const id = req.params.tradeID;
    Trade.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                trade: doc,
                request: {
                    type: 'GET ALL',
                    url: 'http://89.40.11.242:8000/trades'
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

router.patch("/:tradeId", (req, res, next) => {
    const id = req.params.tradeId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Trade.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json({message: 'Trade updated.',
        request: {type: 'GET.', url: "http://89.40.11.242:8000/trades/"+id}});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
 });

router.delete('/:tradeID', (req, res, next) => {
    const id = req.params.tradeID;
    Trade.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Trade deleted',
            request: {
                type: 'POST',
                url: "http://89.40.11.242:8000/trades",
                body: {
                    username: 'String',
                    email: 'String',
                    divbon: 'String',
                    scrip: 'String',
                    buydate: 'Date',
                    qty: 'Number',
                    buyrate: 'Number',
                    buyamount: 'Number',
                    soldpending: 'String',
                    saledate: 'Date',
                    salerate: 'Number',
                    saleamount: 'Number',
                    commrate: 'Number',
                    cgtrate: 'Number',
                    pls: 'Number',
                    netprofit: 'Number',
                    commamount: 'Number',
                    status: 'String'
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});



module.exports = router;