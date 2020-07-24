'use strict';
const Sequelize = require('sequelize');
const Constants= require('../config/systems_constants')

module.exports = (sequelize, DataTypes) => {
    class SoftEstructuraRemuneracion extends Sequelize.Model { }
    SoftEstructuraRemuneracion.init({

      ficha:  DataTypes.STRING,
      codVariable:DataTypes.STRING,
      mes: DataTypes.INTEGER,
      flag:DataTypes.BOOLEAN,
      fecha:DataTypes.DATEONLY,
      emp_codi:DataTypes.INTEGER,
      valor:DataTypes.STRING,


     
    },{ sequelize,tableName: Constants.TABLE_VARIABLES_PERSONA.table,timestamps: false});
    SoftEstructuraRemuneracion.removeAttribute('id');
    return SoftEstructuraRemuneracion
  
  }