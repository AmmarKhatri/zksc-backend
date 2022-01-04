const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const tradeRoutes = require('./api/routes/trades');
const memberRoutes = require('./api/routes/members');
const paymentRoutes = require("./api/routes/payments");
const versionRoutes = require("./api/routes/version");
const scripsRoutes = require("./api/routes/scrips");
const logsRoutes = require("./api/routes/logs");
const liveratesRoutes = require("./api/routes/liverates");


mongoose.connect('mongodb+srv://adminuser:' +process.env.MONGO_ATLAS_PW + '@zksc-umvwm.mongodb.net/zkscdb?retryWrites=true&w=majority', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((res,req,next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//Routes which should handle requests
app.use('/trades', tradeRoutes);
app.use('/members', memberRoutes);
app.use('/payments', paymentRoutes);
app.use('/version', versionRoutes);
app.use('/scrips', scripsRoutes);
app.use('/logs', logsRoutes);
app.use('/liverates', liveratesRoutes);

app.use((req,res,next)=> {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;