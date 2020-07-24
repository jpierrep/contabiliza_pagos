'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SoftCentroCosto extends Sequelize.Model { }
    SoftCentroCosto.init({

      EMP_CODI:  DataTypes.INTEGER,
      CENCO1_CODI:DataTypes.STRING,
      CENCO1_DESC: DataTypes.STRING,
      CENCO2_CODI:DataTypes.STRING,
      CENCO2_DESC:DataTypes.STRING,


     
    },{ sequelize,tableName: 'VIEW_CENTROS_COSTO',timestamps: false});
    SoftCentroCosto.removeAttribute('id');
    return SoftCentroCosto
  }