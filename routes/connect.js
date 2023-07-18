const mysql = require('mysql');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'staffing',
  multipleStatements: true
});

module.exports = {conexion};