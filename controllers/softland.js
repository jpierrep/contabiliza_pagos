'use strict'


var async = require('async');

var readXlsxFile = require('read-excel-file/node');
var stringify = require('json-stringify');
//uso de ficheros
var fs = require('fs');
//rutas de ficheros
var path = require('path');

var sql = require("mssql");
var ExcelFilename;
var moment = require('moment');

var Sequelize = require('sequelize');

var sequelizeMssql = require('../config/connection_mssql')
const Op = Sequelize.Op
const Utils = require('../controllers/utils');
const constants = require('../config/systems_constants')


const PersonaProceso = sequelizeMssql.import('../models/persona_proceso');
const CentroCosto = sequelizeMssql.import('../models/soft_centro_costo');
const PersonaSoftland = sequelizeMssql.import('../models/soft_persona');
const VariablesFicha = sequelizeMssql.import('../models/soft_variables_ficha');




async function getFichasInfoPromise(fichas, empresa) {
  //no depende de fechas 

  let empresaDetalle = constants.EMPRESAS.find(x => x.ID == empresa).BD_SOFTLAND
  //  let mesIndiceSoftland = await sequelizeMssql.query(` SELECT IndiceMes from ` + empresaDetalle.BD_SOFTLAND + `.softland.sw_vsnpRetornaFechaMesExistentes where FechaMes=:mes `,
  //  { replacements: { mes: proceso.Mes }, type: sequelize.QueryTypes.SELECT, raw: true })
  //mesIndiceSoftland = mesIndiceSoftland[0].IndiceMes
  //console.log("mes proceso", mesIndiceSoftland)

  return new Promise(async  resolve => {
    let fichasInfo = await sequelizeMssql.query(`SELECT     
per.ficha as FICHA,per.nombres as NOMBRES,per.rut as RUT,c.CarNom as CARGO_DESC,cc.CodiCC as CENCO2_CODI,cc1.DescCC as CENCO1_DESC,cc.DescCC  as CENCO2_DESC
,area.codArn as AREA_CODI,area_desc.DesArn as AREA_DESC,per.tipoPago as TIPO_PAGO,isapre.CodIsapre as ISAPRE_CODI,isapre.nombre as ISAPRE_NOMBRE,afp.CodAFP as AFP_CODI, afp.nombre as AFP_NOMBRE,cargas.cant_cargas as CANT_CARGAS

FROM 
					               `+ empresaDetalle + `.softland.sw_personal AS per INNER JOIN
                         `+ empresaDetalle + `.softland.sw_cargoper AS cp ON cp.ficha = per.Ficha AND cp.vigHasta = '9999-12-01' INNER JOIN
                         `+ empresaDetalle + `.softland.sw_areanegper AS area ON area.ficha = per.ficha AND area.vigHasta = '9999-12-01' INNER JOIN
                         `+ empresaDetalle + `.softland.cwtcarg AS c ON c.CarCod = cp.carCod INNER JOIN
                         `+ empresaDetalle + `.softland.sw_ccostoper AS ccp ON ccp.ficha = per.ficha AND ccp.vigHasta = '9999-12-01' INNER JOIN
                         `+ empresaDetalle + `.softland.cwtccos AS cc ON cc.CodiCC = ccp.codiCC LEFT OUTER JOIN
                         `+ empresaDetalle + `.softland.sw_glosafiniquito AS fini ON fini.Ficha = per.ficha LEFT OUTER JOIN
                         `+ empresaDetalle + `.softland.cwtccos AS cc1 ON cc1.CodiCC = substring(ccp.codiCC,1,3)+'-000'  LEFT OUTER JOIN
                         `+ empresaDetalle + `.softland.sw_afpper as afp_per on afp_per.ficha=per.ficha  LEFT OUTER JOIN
                         `+ empresaDetalle + `.softland.sw_afp as afp on afp.CodAFP=afp_per.codAFP LEFT OUTER JOIN
                         `+ empresaDetalle + `.softland.sw_isapreper as isapre_per on isapre_per.ficha=per.ficha  LEFT OUTER JOIN
                         `+ empresaDetalle + `.softland.sw_isapre as isapre on isapre.CodIsapre=isapre_per.codIsapre LEFT OUTER JOIN
                         `+ empresaDetalle + `.softland.cwtaren AS area_desc ON area.codArn = area_desc.CodArn  LEFT OUTER JOIN
                         (SELECT ficha,count(*) as cant_cargas  FROM `+ empresaDetalle + `.softland.sw_cargas where vigHasta>=convert(date,getdate())	group by ficha) cargas  on cargas.ficha=per.ficha

                         where per.ficha in (:fichas)
                         `,
      { replacements: { fichas: fichas }, type: sequelizeMssql.QueryTypes.SELECT, raw: true })


    resolve(fichasInfo)

  })


}





async function getFichasInfoPromiseMes(fichas, empresa, mes) {
  //no depende de fechas 

  let empresaDetalle = constants.EMPRESAS.find(x => x.ID == empresa).BD_SOFTLAND
  //  let mesIndiceSoftland = await sequelizeMssql.query(` SELECT IndiceMes from ` + empresaDetalle.BD_SOFTLAND + `.softland.sw_vsnpRetornaFechaMesExistentes where FechaMes=:mes `,
  //  { replacements: { mes: proceso.Mes }, type: sequelize.QueryTypes.SELECT, raw: true })
  //mesIndiceSoftland = mesIndiceSoftland[0].IndiceMes
  //console.log("mes proceso", mesIndiceSoftland)

  return new Promise(async  resolve => {
    let fichasInfo = await sequelizeMssql.query(`SELECT     
  per.ficha as FICHA,per.nombres as NOMBRES,per.rut as RUT,c.CarNom as CARGO_DESC,cc.CodiCC as CENCO2_CODI,cc1.DescCC as CENCO1_DESC,cc.DescCC  as CENCO2_DESC
  ,area.codArn as AREA_CODI,area_desc.DesArn as AREA_DESC,per.tipoPago as TIPO_PAGO,isapre.CodIsapre as ISAPRE_CODI,isapre.nombre as ISAPRE_NOMBRE,afp.CodAFP as AFP_CODI, afp.nombre as AFP_NOMBRE,cargas.cant_cargas as CANT_CARGAS
  
  FROM 
                           `+ empresaDetalle + `.softland.sw_personal AS per INNER JOIN
                           `+ empresaDetalle + `.softland.sw_cargoper AS cp ON cp.ficha = per.Ficha AND '` + mes + `' between cp.vigDesde and cp.vigHasta  INNER JOIN
                           `+ empresaDetalle + `.softland.sw_areanegper AS area ON area.ficha = per.ficha AND '` + mes + `' between area.vigDesde and area.vigHasta  INNER JOIN
                           `+ empresaDetalle + `.softland.cwtcarg AS c ON c.CarCod = cp.carCod INNER JOIN
                           `+ empresaDetalle + `.softland.sw_ccostoper AS ccp ON ccp.ficha = per.ficha AND '` + mes + `' between ccp.vigDesde and ccp.vigHasta  INNER JOIN
                           `+ empresaDetalle + `.softland.cwtccos AS cc ON cc.CodiCC = ccp.codiCC LEFT OUTER JOIN
                           `+ empresaDetalle + `.softland.sw_glosafiniquito AS fini ON fini.Ficha = per.ficha LEFT OUTER JOIN
                           `+ empresaDetalle + `.softland.cwtccos AS cc1 ON cc1.CodiCC = substring(ccp.codiCC,1,3)+'-000'  LEFT OUTER JOIN
                           `+ empresaDetalle + `.softland.sw_afpper as afp_per on afp_per.ficha=per.ficha  LEFT OUTER JOIN
                           `+ empresaDetalle + `.softland.sw_afp as afp on afp.CodAFP=afp_per.codAFP LEFT OUTER JOIN
                           `+ empresaDetalle + `.softland.sw_isapreper as isapre_per on isapre_per.ficha=per.ficha  LEFT OUTER JOIN
                           `+ empresaDetalle + `.softland.sw_isapre as isapre on isapre.CodIsapre=isapre_per.codIsapre LEFT OUTER JOIN
                           `+ empresaDetalle + `.softland.cwtaren AS area_desc ON area.codArn = area_desc.CodArn  LEFT OUTER JOIN
                           (SELECT ficha,count(*) as cant_cargas  FROM `+ empresaDetalle + `.softland.sw_cargas where  '` + mes + `' between vigDesde and vigHasta	group by ficha) cargas  on cargas.ficha=per.ficha
  
                           where per.ficha in (:fichas)
                           `,
      { replacements: { fichas: fichas }, type: sequelize.QueryTypes.SELECT, raw: true })


    resolve(fichasInfo)

  })


}





async function getPagosContabilizar() {

   //captura pagos

  return new Promise(async  resolve => {
    let pagosResumen = await sequelizeMssql.query(`
   

---resumen por PAGO a contabilizar

select IdPago,MontoPagoTotal,sum(SoftSaldo) as saldoDoctos ,sum(monto) as SumMontoPago,count(NumeroDocumento) as CantDoctos,MontoPagoTotal-sum(monto) as saldoPagos,sum(SoftSaldo)-sum(monto) as saldoDoctosTotal
from
(


                  Select Enlaze.Documento as IdDocumento, CONVERT(int,replace(Documentos.Numero,' ','')) as NumeroDocumento,enlaze.Pago as IdPago, enlaze.Monto as Monto
                 ,Enlaze.Fecha as 'FechaPago',tabla.cantMovim as SoftCantMovim,tabla.saldo as SoftSaldo,tabla.fecha as SoftMinFecha,DocPago.Monto as MontoPagoTotal
                 ,DocPago.Fecha as FechaGral,DocPago.tipo as TipoPago,DocPago.Numero as NumeroPago, DocPago.Rut as RutCliente,DocPago.Codigo as CodigoCliente,Documentos.Nombre as NombreDocto
            
                 From 
                 
             
                 Invoicing.dbo.Enlaze 
                 Left JOIN Invoicing.dbo.Documentos 
                 ON Documento = Id_Documento 
                 LEFT JOIN Invoicing.dbo.Rubros 
                 ON Documentos.Rubro = IdRubro 
                 left Join Invoicing.dbo.DocPago 
                ON Enlaze.Pago = DocPago.Id_Pago
           --     inner join @tabla as tabla on tabla.MovNumDocRef=CONVERT(int,replace(Documentos.Numero,' ',''))
                inner join (
         select MovNumDocRef, SUM(MovDebe-MovHaber) as saldo,Count(*) as cantMovim, MIN(movFe) as Fecha, aux.Codaux,aux.rutAux ,aux.NomAux 
  FROM guard.[softland].[cwmovim] as mov 
  left join guard.[softland].[cwtauxi] as aux on mov.CodAux=AUX.CodAux 
left join guard.softland.cwcpbte as comp on comp.CpbNum=mov.CpbNum and comp.CpbAno=mov.CpbAno and comp.CpbMes=mov.CpbMes 
   where  mov.CpbMes!='00' and   comp.CpbEst='V' and   PctCod='10-01-065'
 
group by MovNumDocRef, aux.Codaux,rutAux,aux.NomAux

having SUM(MovDebe-MovHaber)<>0

--order by  MIN(movFe)  asc
        ) as tabla  on tabla.MovNumDocRef=CONVERT(int,replace(Documentos.Numero,' ',''))
        
        Where  DocPago.Empresa =0 And DocPago.Tipo in ( 1, 2, 3, 5, 6, 9, 10 ) --todos los tipos de pago menos castigo nota credito nota debito 
                   and Documentos.Tipo  In (1)  --solo facturas facturas 
       --    and DocPago.Fecha between '20210601' and '202010630'
       and month(docPago.fecha)=07 and year(docPago.fecha)=2021
--	 and CONVERT(int,replace(Documentos.Numero,' ','')) =214839

               

)a

group by IdPago,MontoPagoTotal
order by MontoPagoTotal-sum(monto) asc


  

                           `,
      { type: sequelizeMssql.QueryTypes.SELECT, raw: true })


    resolve(pagosResumen)

  })

}



async function getPagosContabilizarDetalle() {

  //captura pagos

 return new Promise(async  resolve => {
   let pagosDetalle = await sequelizeMssql.query(`
  

   select * from
   (
 
 
                     Select Enlaze.Documento as IdDocumento, CONVERT(int,replace(Documentos.Numero,' ','')) as NumeroDocumento,enlaze.Pago as IdPago, enlaze.Monto as Monto
                    ,Enlaze.Fecha as 'FechaPago',tabla.cantMovim as SoftCantMovim,tabla.saldo as SoftSaldo,tabla.fecha as SoftMinFecha,DocPago.Monto as MontoPagoTotal
                    ,DocPago.Fecha as FechaGral,DocPago.tipo as TipoPago,DocPago.Numero as NumeroPago, DocPago.Rut as RutCliente,DocPago.Codigo as CodigoCliente,Documentos.Nombre as NombreDocto
                    ,CodAux,NomAux,AreaCod
                    
                    From 
                    
                
                    Invoicing.dbo.Enlaze 
                    Left JOIN Invoicing.dbo.Documentos 
                    ON Documento = Id_Documento 
                    LEFT JOIN Invoicing.dbo.Rubros 
                    ON Documentos.Rubro = IdRubro 
                    left Join Invoicing.dbo.DocPago 
                   ON Enlaze.Pago = DocPago.Id_Pago
              --     inner join @tabla as tabla on tabla.MovNumDocRef=CONVERT(int,replace(Documentos.Numero,' ','))
                   inner join (
            select MovNumDocRef,SUM(MovDebe-MovHaber) as saldo,Count(*) as cantMovim, MIN(movFe) as Fecha, aux.Codaux,aux.rutAux ,aux.NomAux ,mov.AreaCod
     FROM guard.[softland].[cwmovim] as mov 
     left join guard.[softland].[cwtauxi] as aux on mov.CodAux=AUX.CodAux 
  left join guard.softland.cwcpbte as comp on comp.CpbNum=mov.CpbNum and comp.CpbAno=mov.CpbAno and comp.CpbMes=mov.CpbMes 
      where  mov.CpbMes!='00' and   comp.CpbEst='V' and   PctCod='10-01-065'
    
   group by MovNumDocRef, aux.Codaux,rutAux,aux.NomAux,mov.AreaCod
   
   having SUM(MovDebe-MovHaber)<>0
 
   --order by  MIN(movFe)  asc
           ) as tabla  on tabla.MovNumDocRef=CONVERT(int,replace(Documentos.Numero,' ',''))
           
           Where  DocPago.Empresa =0 And DocPago.Tipo in ( 1, 2, 3, 5, 6, 9, 10 ) --todos los tipos de pago menos castigo nota credito nota debito 
                      and Documentos.Tipo  In (1)  --solo facturas facturas 
          --    and DocPago.Fecha between '20210601' and '202010630'
          and month(docPago.fecha)=07 and year(docPago.fecha)=2021
              --     order by Enlaze.Pago asc
 
 
 )a
 
 

                          `,
     { type: sequelizeMssql.QueryTypes.SELECT, raw: true })


   resolve(pagosDetalle)

 })

}













module.exports = {
  getFichasInfoPromise, getFichasInfoPromiseMes,getPagosContabilizar,getPagosContabilizarDetalle
}


