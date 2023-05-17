const mysql = require('mysql');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'S3rv3r',
  database: 'staffing_project',
  multipleStatements: true
});

module.exports = {conexion};