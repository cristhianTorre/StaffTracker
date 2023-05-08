const mysql = require('mysql');

const conexion = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'staffing_project'
});

module.exports = {conexion};