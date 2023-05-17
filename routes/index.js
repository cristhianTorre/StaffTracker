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
    var direccionNueva = req.body.direccion || 'CORE';
    var servicioNueva = req.body.servicio || 'Cross/Gestor documental y SSDD';
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

router.get('/personas', function(req,res){
    var seleccion = ['SELECT id_direccion, direccion FROM parametros GROUP BY id_direccion',
                    'SELECT id, servicio FROM parametros'];
    connect.conexion.query(seleccion.join(';'), function (error, results, fields) {
        if (error) throw error;
        res.render('personas', {direccion: JSON.parse(JSON.stringify(results[0])), servicio:JSON.parse(JSON.stringify(results[1]))});
    });
});

router.post('/personas', function(req, res){
    var direccion = req.body.direccion;
    var servicio = req.body.servicio;
    var consulta = ['SELECT id_direccion, direccion FROM parametros GROUP BY id_direccion',
                    'SELECT id, servicio FROM parametros', 
                    'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON, SUM(staffing.dedicacion)*100 as dedicacion FROM staff INNER JOIN habilidades ON staff.id = habilidades.id INNER JOIN staffing ON staffing.nombre = staff.nombre WHERE staff.direccion = "'+direccion+'" and staff.servicio = "'+servicio+'" GROUP BY staff.nombre'];
    connect.conexion.query(consulta.join(';'), function (error, results, fields) {
        if (error) throw error;
        res.render('personas', {direccion: JSON.parse(JSON.stringify(results[0])), servicio:JSON.parse(JSON.stringify(results[1])), persona: JSON.parse(JSON.stringify(results[2]))});
    });
});

router.post('/guardar', function(req, res){
    var personas = req.body.persona;
    var dedicaciones = req.body.dedicacion;
    var tecnologias = req.body.tecnologia;
    var fechai = req.body.fechaIni;
    var fechaf = req.body.fechaFin;
    var id = req.body.proyecto;
    var update = 'UPDATE proyectos SET fecha_inicial="'+fechai+'", fecha_final="'+fechaf+'" WHERE id="'+ id +'"';
    for(var i = 0; i<personas.length; i++){
        var insert = 'INSERT INTO `staffing`(`id`, `codigo`, `nombre`, `direccion`, `servicio`, `empresa`, `proyecto`, `dedicacion`, `rol`, `tecnologia`) VALUES (null,"'+personas[i].codigo+'","'+personas[i].nombre+'","'+personas[i].direccion+'","'+personas[i].servicio+'","'+personas[i].empresa+'","'+personas[i].proyecto+'","'+dedicaciones[i]+'","'+personas[i].rol+'","'+tecnologias[i]+'")';
        connect.conexion.query(insert, function(error, results, fields){
            if (error) throw error;
            console.log('Funciona');
        });
    }
    connect.conexion.query(update, function(error, results, fields){
        if (error) throw error;
        console.log('FUNCIONA');
    });
});

module.exports = router;