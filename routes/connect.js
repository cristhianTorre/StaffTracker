const mysql = require('mysql');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'staffing_project'
});

conexion.connect();

module.exports = conexion;