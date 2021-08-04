'use strict'

var express = require('express');
var fs = require('fs');

var SoftlandController = require('../controllers/softland');
const Utils = require('../controllers/utils');

async function getTest (req,res) {

    console.log("test")
   let pagosResumen= await SoftlandController.getPagosContabilizar()
   let pagosDetalle= await SoftlandController.getPagosContabilizarDetalle()
   let distinctAreas=Utils.getUniqueProp(pagosDetalle,'AreaCod')
   //existen pagos que tienen varias areas, deberá los con saldo 0, distribuirse segun el area
   pagosResumen.map(x=>{
     x["AreaCod"]= pagosDetalle.find(y=>y["IdPago"]==x["IdPago"])["AreaCod"]
     return x
   })


console.log(distinctAreas)
   
   //console.log(pagosResumen)



distinctAreas.forEach(areaArchivo=>{


pagosResumen.filter(x=>x["saldoPagos"]==0&&x["AreaCod"]==areaArchivo). forEach(pago=>{
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
  let asiento_encabezado='10-01-003,'+pago["MontoPagoTotal"]+',0,"'+pagosDetalle.find(x=>x["IdPago"]==pago["IdPago"])["NomAux"]+'",,,,,,,,,,,,,,,,DP,62,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n'
  fs.appendFileSync("testArchivos/"+areaArchivo+".txt", asiento_encabezado);

    //aqui va el detalle que tiene que ir en el asiento
  //let asiento_detalle=
  pagosDetalle.filter(x=>x["IdPago"]==pago["IdPago"]).forEach(pagoDetalle=>{
  //  10-01-065,0,384413,SOPRAVAL SPA.  [P: 338204 D: 569912],,,,,,,,,,,,,,,82366700,DP,62,01/07/2021,01/07/2021,FV,216094 ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  let asiento_detalle='10-01-065,0,'+pagoDetalle["Monto"]+',"'+pagoDetalle["NomAux"]+ ' [P:'+pagoDetalle["IdPago"]+' D:'+pagoDetalle["IdDocumento"]+']",,,,,,,,,,,,,,,'+pagoDetalle["CodAux"]+',DP,62,01/07/2021,01/07/2021,FV,'+pagoDetalle["NumeroDocumento"]+',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n'
  fs.appendFileSync("testArchivos/"+areaArchivo+".txt", asiento_detalle);
  })

})

})

return res.status(200).send({ status: "ok" })
}

module.exports = {
  getTest
  }