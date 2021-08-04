'use strict'

function convierteRutID (rut){
     
    rut=rut.substr(0,rut.length-1);
    rut=replaceAll(rut,".","");
    rut=replaceAll(rut,"-","");
    // rut1=rut.replace(".","");
    if (isNaN(parseFloat(rut)) && !isFinite(rut))
      rut=0;
    
  
 //  console.log("el rut es:"+rut);
   return parseInt(rut);
  }

  
  function replaceAll (string, omit, place, prevstring) {
    if (prevstring && string === prevstring)
      return string;
    prevstring = string.replace(omit, place);
    return replaceAll(prevstring, omit, place, string)
  }

  function getUnique(data){
    let unique = (value, index, self) => {
        return self.indexOf(value) == index;
    }
    return data.filter(unique).sort(); 

 }

 function getUniqueProp(data,prop){

  data=data.map(value=>{
    return value[prop];
  });

  let unique = (value, index, self) => {
      return self.indexOf(value) == index;
  }
  return data.filter(unique).sort(); 

}




  module.exports={convierteRutID,getUniqueProp,getUnique}