'use strict'

var express = require('express');
var fs = require('fs');
var zip = require('express-zip');
var SoftlandController = require('../controllers/softland');
const Utils = require('../controllers/utils');
const moment=require('moment')





async function getContabilizaPagos (req,res) {
  console.log("he")
 let mes='2021-07-01' //extraer ultimo mes por defecto
 mes=moment().startOf('month').format('YYYY-MM-DD')
 let listMonths=[]
 for (let index = 0; index < 12; index++) {

  listMonths[index]=  moment(mes).subtract(index, 'months').format('YYYY-MM-DD');;
  
}
console.log(listMonths)

 let empresa=0
  let pagosResumen= await SoftlandController.getPagosContabilizar(empresa,mes)
  console.log(pagosResumen.length)
  res.render("contabiliza_pagos.ejs", { pagosResumen: pagosResumen,listaMeses:listMonths });

}


async function getContabilizaPagosMes (req,res) {
  console.log("he")
 let empresa=req.body.empresa
 let mes=req.body.mes
 console.log(empresa,mes)
  let pagosResumen= await SoftlandController.getPagosContabilizar(empresa,mes)
  console.log(pagosResumen.length)
  return res.status(200).send({status:'OK',pagosResumen: pagosResumen });
}




async function getArchivosContables (req,res) {
 
  let empresa=req.body.empresa
  let mes=req.body.mes
  console.log(empresa,mes)

  let pagosDetalle= await SoftlandController.getPagosContabilizarDetalle(empresa,mes)
  //encuentra pagos descuadrados con sofltand (pago distinto a lo pendiente) para luegos filtrar
  let pagosdocumentosNoCuadrados=pagosDetalle.filter(x=>parseInt( x['SoftSaldo'])<parseInt(x['Monto']))
  let pagosNoCuadrados=[]
  if (pagosdocumentosNoCuadrados.length>0)   pagosNoCuadrados=pagosdocumentosNoCuadrados.map(x=>x["IdPago"])
 

   let pagosResumen= (await SoftlandController.getPagosContabilizar(empresa,mes)).filter(x=>x["saldoPagos"]==0&&x["TipoPagoId"]==6&&x["saldoDoctosTotal"]>=0
   &&!pagosNoCuadrados.includes(x["IdPago"])
   ) //por el momento solo depositos directo ya que cheques por ejemplo se contabilizan distinto
   //se excluyen los pagos que no cuadren internamente con los documentos y aquellos pagos que tengan documentos no cuadrados
 
   

   if (pagosResumen.length==0){
    res.status(500).send( { status: "vacio" });
   }


   //existen pagos que tienen varias areas, deberá los con saldo 0, distribuirse segun el area
   pagosResumen.map(x=>{
     x["AreaCod"]= pagosDetalle.find(y=>y["IdPago"]==x["IdPago"])["AreaCod"]
     return x
   })
   let distinctAreas=Utils.getUniqueProp(pagosResumen,'AreaCod')
 let folderName=empresa+'_'+mes.replace(/-/g, '').substr(0,6)+'_'+Date.now()
  let dirDestino='ArchivosProcesos/'+folderName
  if (!fs.existsSync(dirDestino)){
    
    fs.mkdirSync(dirDestino,{recursive:true});
    console.log("no existe carpeta, creada la carpeta del proceso")
}

console.log(distinctAreas)
console.log(dirDestino)
   
   //console.log(pagosResumen)



distinctAreas.forEach(areaArchivo=>{


pagosResumen.filter(x=>x["AreaCod"]==areaArchivo). forEach(pago=>{
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
  let asiento_encabezado='10-01-003,'+pago["MontoPagoTotal"]+',0,"'+pagosDetalle.find(x=>x["IdPago"]==pago["IdPago"])["NomAux"]+'",,,,,,,,,,,,,DP,62,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n'
  fs.appendFileSync(dirDestino+"/"+areaArchivo+".txt", asiento_encabezado);

    //aqui va el detalle que tiene que ir en el asiento
  //let asiento_detalle=
  pagosDetalle.filter(x=>x["IdPago"]==pago["IdPago"]).forEach(pagoDetalle=>{
  //  10-01-065,0,384413,SOPRAVAL SPA.  [P: 338204 D: 569912],,,,,,,,,,,,,,,82366700,DP,62,01/07/2021,01/07/2021,FV,216094 ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  let asiento_detalle='10-01-065,0,'+pagoDetalle["Monto"]+',"[P:'+pagoDetalle["IdPago"]+' D:'+pagoDetalle["IdDocumento"]+'] '+pagoDetalle["NomAux"]+ '",,,,,,,,,,,,,,,'+pagoDetalle["CodAux"]+',DP,62,'+pagoDetalle["FechaGral"]+',' +pagoDetalle["FechaGral"]+','+pagoDetalle["MovTipDocRef"]+','+pagoDetalle["NumeroDocumento"]+',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\r\n'
  fs.appendFileSync(dirDestino+"/"+areaArchivo+".txt", asiento_detalle);
  })

})

})

//return res.status(200).send({ status: "ok" })

//const file = `testArchivos/002.txt`;
//return res.download(file); // Set disposition and send it.

/*
res.zip([
  { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' }
  { path: '/path/to/file2.name', name: 'file2.name' }
]);
*/

//crear carpeta temporal con id de proceso y luego eliminarla , leer archivo y luego en el momento actualizarlo, luego elimianar los archivos temporales
let downloadFiles=distinctAreas.map(x=>{
return {path:dirDestino+"/"+x+'.txt',name:folderName+"/"+x+'.txt'}

})
console.log(downloadFiles)
return res.zip(
 downloadFiles

);

}

module.exports = {
  getArchivosContables,getContabilizaPagos,getContabilizaPagosMes
  }