/*var express = require('express');
const rrhhRouter = require('./routes/rrhhRouter');
const rrhhRouterPers = require('./routes/rrhhRouter');
const asistDiasTrabRouter = require('./routes/asistDiasTrabRouter');
const getDiferencias = require('./routes/rrhhRouter');

var app = express();

app.use('/rrhhRouter',rrhhRouter);
app.use('/rrhhRouterPers',rrhhRouterPers);
app.use('/asistDiasTrab',asistDiasTrabRouter);
app.use('/getDiferencias',getDiferencias);

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

*/

'use strict'
//index js para hacer las conexiones y la creacion del servidor


var app=require('./app');
var port= 3700;
var ip='0.0.0.0';


    app.listen(port,ip,()=>{
        console.log("Servidor corriendo en ip "+ip+" puerto "+ port )
    });

