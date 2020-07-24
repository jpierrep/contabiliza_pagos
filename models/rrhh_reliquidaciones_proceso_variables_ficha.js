'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RrhhReliquidacionesProcesoVariablesFicha extends Sequelize.Model { }
    RrhhReliquidacionesProcesoVariablesFicha.init({

      procesoId: DataTypes.INTEGER,
      ficha:  DataTypes.STRING,
      codVariable:DataTypes.STRING,
      mes: DataTypes.INTEGER,
      flag:DataTypes.BOOLEAN,
      fecha:DataTypes.DATEONLY,
      emp_codi:DataTypes.INTEGER,
      valor:DataTypes.STRING,
      etapa:DataTypes.INTEGER


    }, { sequelize,paranoid: true });
    return RrhhReliquidacionesProcesoVariablesFicha
  }