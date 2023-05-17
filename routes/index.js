var express = require('express');
var router = express.Router();
var funciones = require('./funciones');
const connect = require('./connect');

router.get('/', function(req, res){
    var parametros = ['SELECT * FROM parametros',
    'SELECT * FROM staffing',
    'SELECT * FROM proyectos',
    'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON FROM staff INNER JOIN habilidades ON staff.id = habilidades.id'];
    connect.conexion.query(parametros.join(';'), function (error, results, fields) {
        if (error) throw error;
        res.render('index', {direccion: funciones.getDirecciones(JSON.parse(JSON.stringify(results[0]))), servicio: funciones.getServicios(JSON.parse(JSON.stringify(results[0])))});
      });
});


router.post('/', function(req, res){
    //'CORE' 'Cross/Gestor documental y SSDD'
    var direccionNueva = req.body.direccion;
    var servicioNueva = req.body.servicio; 
    var parametros = ['SELECT * FROM parametros',
    'SELECT * FROM staffing',
    'SELECT * FROM proyectos',
    'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON FROM staff INNER JOIN habilidades ON staff.id = habilidades.id'];
    connect.conexion.query(parametros.join(';'), function (error, results, fields) {
        if (error) throw error;
        res.render('index', {proyectos: funciones.getProyectos(JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3])), JSON.parse(JSON.stringify(results[2])), direccionNueva, servicioNueva), backlog: funciones.getNewsProyectos(JSON.parse(JSON.stringify(results[2])), JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3]))), direccion: funciones.getDirecciones(JSON.parse(JSON.stringify(results[0]))), servicio: funciones.getServicios(JSON.parse(JSON.stringify(results[0])))});
      });
});

router.post('/actualizar', function(req, res){
    var id = req.body.proyecto;
    var parametros = ['SELECT * FROM parametros',
    'SELECT * FROM staffing',
    'SELECT * FROM proyectos',
    'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON FROM staff INNER JOIN habilidades ON staff.id = habilidades.id',
    'UPDATE proyectos SET status="Flow" WHERE id="'+ id +'"'];
    connect.conexion.query(parametros.join(';'), function (error, results, fields) {
        if (error) throw error;
        console.log("Funciona");
        res.render('index', {proyectos: funciones.getProyectos(JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3])), JSON.parse(JSON.stringify(results[2])), direccionNueva, servicioNueva), backlog: funciones.getNewsProyectos(JSON.parse(JSON.stringify(results[2])), JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3]))), direccion: funciones.getDirecciones(JSON.parse(JSON.stringify(results[0]))), servicio: funciones.getServicios(JSON.parse(JSON.stringify(results[0])))});
    });
});

router.get('/personas', function(req, res){
    var consulta = 'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON, SUM(staffing.dedicacion)*100 as dedicacion FROM staff INNER JOIN habilidades ON staff.id = habilidades.id INNER JOIN staffing ON staffing.nombre = staff.nombre WHERE staff.direccion = "CORE" and staff.servicio = "Cross/Gestor documental y SSDD" GROUP BY staff.nombre';
    connect.conexion.query(consulta, function (error, results, fields) {
        if (error) throw error;
        res.render('personas', {persona: JSON.parse(JSON.stringify(results))});
    });
});

module.exports = router;