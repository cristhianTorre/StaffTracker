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
        res.render('index', {proyectos: funciones.getProyectos(JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3])), JSON.parse(JSON.stringify(results[2])),'CORE','Cross/Gestor documental y SSDD'), backlog: funciones.getNewsProyectos(JSON.parse(JSON.stringify(results[2])), JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3]))), direccion: funciones.getDirecciones(JSON.parse(JSON.stringify(results[0])))});
      });
});

router.get('/proyectos', function(req, res){
    let prueba = {proyecto: funciones.proyectosBD, emplo: funciones.staffingBD};
    res.render('pruebas', prueba);
});

router.post('/', function(req, res){
    var body = req.body;
    var codigo = body.codigo;
    var proyecto = body.proyecto;
    var dedicacion = body.dedicacion;
    var res_option = {opcion: funciones.getServicios(body.opcion)}
    res.render('index', res_option);
});

router.get('/personas', function(req, res){
    var consulta = 'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON FROM staff INNER JOIN habilidades ON staff.id = habilidades.id WHERE direccion = "CORE" and servicio = "Cross/Gestor documental y SSDD"';
    connect.conexion.query(consulta, function (error, results, fields) {
        if (error) throw error;
        res.render('personas', {persona: JSON.parse(JSON.stringify(results))});
    });
});

module.exports = router;