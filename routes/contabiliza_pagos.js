var express=require('express');
var api=express.Router();
var ContabilizaPagosController=require('../controllers/contabiliza_pagos');


//api.get('/test',ContabilizaPagosController.getTest);

api.post('/getArchivosContables',ContabilizaPagosController.getArchivosContables);

api.get('/mainView',ContabilizaPagosController.getContabilizaPagos);
//api.get('/testApi',ContabilizaPagosController.getContabilizaPagos2);

api.post('/getPagosMes',ContabilizaPagosController.getContabilizaPagosMes);

//api.get('/testFiles',NominaBancariaController.getMontosNominaFiles);

module.exports=api;