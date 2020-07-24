'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PersonaSoftland extends Sequelize.Model { }
    PersonaSoftland.init({

      FICHA:  DataTypes.STRING,
      NOMBRES: DataTypes.STRING,
      RUT:DataTypes.STRING ,
      RUT_ID: DataTypes.INTEGER,
      DIRECCION: DataTypes.STRING,
      FECHA_INGRESO: DataTypes.DATE,
      ESTADO: DataTypes.STRING,
      CARGO_DESC: DataTypes.STRING,
      CENCO2_CODI: DataTypes.STRING
     
    }, { sequelize,paranoid: true });
    return PersonaSoftland
  }
  
