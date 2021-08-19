var express=require('express');
var api=express.Router();
var ContabilizaPagosController=require('../controllers/contabiliza_pagos');


//api.get('/test',ContabilizaPagosController.getTest);

api.post('/test',ContabilizaPagosController.getTest);

api.get('/mainView',ContabilizaPagosController.getContabilizaPagos);

api.post('/getPagosMes',ContabilizaPagosController.getContabilizaPagosMes);

//api.get('/testFiles',NominaBancariaController.getMontosNominaFiles);

module.exports=api;