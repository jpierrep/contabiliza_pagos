'use strict';
//persona consultada de softland
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
      CENCO2_CODI: DataTypes.STRING,
      FECHA_SOFT: DataTypes.DATE,
     
    }, { sequelize,tableName: 'VIEW_SOFT_PERSONAL_VIGENTE',timestamps: false});
    PersonaSoftland.removeAttribute('id');
    return PersonaSoftland
  }
  
