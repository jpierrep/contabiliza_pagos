'use strict'

var express = require('express');
var fs = require('fs');

var SoftlandController = require('../controllers/softland');

async function getTest (req,res) {

    console.log("test")
   let pagosResumen= await SoftlandController.getPagosContabilizar()
   let pagosDetalle= await SoftlandController.getPagosContabilizarDetalle()
   console.log(pagosResumen)

pagosResumen.filter(x=>x["saldoPagos"]==0). forEach(pago=>{
/*
  {
    IdPago: 338815,
    MontoPagoTotal: 33586,
    saldoDoctos: 60,
    SumMontoPago: 33586,
    CantDoctos: 1,
    saldoPagos: 0
  }
  */

  //10-01-003,549161,0,SOPRAVAL SPA. ,,,,,,,,,,,,,,,,DP,62,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  let asiento_encabezado='10-01-003,'+pago["MontoPagoTotal"]+',0,"'+pagosDetalle.find(x=>x["IdPago"]==pago["IdPago"])["NomAux"]+'",,,,,,,,,,,,,,,,DP,62,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'
  fs.appendFileSync("test.txt", asiento_encabezado);
  pagosDetalle.filter(x=>x["IdPago"]==pago["IdPago"])
  //aqui va el detalle que tiene que ir en el asiento
  //let asiento_detalle=
})




}

module.exports = {
  getTest
  }