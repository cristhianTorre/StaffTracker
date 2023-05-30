var express = require('express');
var router = express.Router();
var funciones = require('./funciones');
const connect = require('./connect');

router.get('/', function(req, res){
    return res.redirect('/login');
});

router.get('/proyectos', function (req, res) {
    var jefe = req.session.codigo;
    var parametros = ['SELECT * FROM parametros',
        'SELECT * FROM staffing',
        'SELECT * FROM proyectos',
        'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON FROM staff INNER JOIN habilidades ON staff.id = habilidades.id',
        'SELECT direccion, servicio FROM staff WHERE codigo =?'];
    connect.conexion.query(parametros.join(';'), [jefe], function (error, results, fields) {
        if (error) throw error;
        res.render('index', { proyectos: funciones.getProyectos(JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[2])), results[4][0].direccion, results[4][0].servicio), backlog: funciones.getNewsProyectos(JSON.parse(JSON.stringify(results[2])), JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3])), jefe), direccion: funciones.getDirecciones(JSON.parse(JSON.stringify(results[0]))), servicio: funciones.getServicios(JSON.parse(JSON.stringify(results[0])))});
    });
});


router.post('/proyectos-post', function (req, res) {
    var jefe = req.session.codigo;
    var direccionNueva = req.body.direccion;
    var servicioNueva = req.body.servicio;
    var parametros = ['SELECT * FROM parametros',
        'SELECT * FROM staffing',
        'SELECT * FROM proyectos',
        'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON FROM staff INNER JOIN habilidades ON staff.id = habilidades.id'];
    connect.conexion.query(parametros.join(';'), function (error, results, fields) {
        if (error) throw error;
        res.render('index', { proyectos: funciones.getProyectos(JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[2])), direccionNueva, servicioNueva), backlog: funciones.getNewsProyectos(JSON.parse(JSON.stringify(results[2])), JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3])), jefe), direccion: funciones.getDirecciones(JSON.parse(JSON.stringify(results[0]))), servicio: funciones.getServicios(JSON.parse(JSON.stringify(results[0]))) });
    });
});

router.post('/actualizar', function (req, res) {
    var id = req.body.proyecto;
    var direccionNueva = req.body.direccion || 'CORE';
    var servicioNueva = req.body.servicio || 'Cross/Gestor documental y SSDD';
    var parametros = ['SELECT * FROM parametros',
        'SELECT * FROM staffing',
        'SELECT * FROM proyectos',
        'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON FROM staff INNER JOIN habilidades ON staff.id = habilidades.id',
        'UPDATE proyectos SET status="Flow" WHERE id="' + id + '"'];
    connect.conexion.query(parametros.join(';'), function (error, results, fields) {
        if (error) throw error;
        return res.redirect('/proyectos');
        //res.render('index', { proyectos: funciones.getProyectos(JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[2])), direccionNueva, servicioNueva), backlog: funciones.getNewsProyectos(JSON.parse(JSON.stringify(results[2])), JSON.parse(JSON.stringify(results[1])), JSON.parse(JSON.stringify(results[3]))), direccion: funciones.getDirecciones(JSON.parse(JSON.stringify(results[0]))), servicio: funciones.getServicios(JSON.parse(JSON.stringify(results[0]))) });
    });
});

router.get('/personas', function (req, res) {
    var jefe = req.session.codigo;
    var seleccion = ['SELECT id_direccion, direccion FROM parametros GROUP BY id_direccion',
        'SELECT id, servicio FROM parametros',
        'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON, SUM(staffing.dedicacion)*100 as dedicacion FROM staff INNER JOIN habilidades ON staff.id = habilidades.id INNER JOIN staffing ON staffing.nombre = staff.nombre WHERE staff.superior = "' + jefe + '" GROUP BY staff.nombre',
        'SELECT codigo, proyecto, dedicacion FROM staffing'];
    connect.conexion.query(seleccion.join(';'), function (error, results, fields) {
        if (error) throw error;
        res.render('personas', { direccion: JSON.parse(JSON.stringify(results[0])), servicio: JSON.parse(JSON.stringify(results[1])), persona: funciones.obtenerProyectos(JSON.parse(JSON.stringify(results[3])), JSON.parse(JSON.stringify(results[2]))) });
    });
});

router.post('/personas-post', function (req, res) {
    var direccion = req.body.direccion;
    var servicio = req.body.servicio;
    var consulta = ['SELECT id_direccion, direccion FROM parametros GROUP BY id_direccion',
        'SELECT id, servicio FROM parametros',
        'SELECT staff.*, ASO, APX, CELLS, HOST, BLUESPRING, SCALA, PYTHON, SUM(staffing.dedicacion)*100 as dedicacion FROM staff INNER JOIN habilidades ON staff.id = habilidades.id INNER JOIN staffing ON staffing.nombre = staff.nombre WHERE staff.superior = "' + direccion + '" and staff.servicio = "' + servicio + '" GROUP BY staff.nombre',
        'SELECT codigo, proyecto, dedicacion FROM staffing'];
    connect.conexion.query(consulta.join(';'), function (error, results, fields) {
        if (error) throw error;
        res.render('personas', { direccion: JSON.parse(JSON.stringify(results[0])), servicio: JSON.parse(JSON.stringify(results[1])), persona: funciones.obtenerProyectos(JSON.parse(JSON.stringify(results[3])), JSON.parse(JSON.stringify(results[2]))) });
    });
});

router.post('/guardar', function (req, res) {
    var dedicaciones = req.body.dedicacion;
    var tecnologias = req.body.asignar;
    var fechai = req.body.fechaIni;
    var fechaf = req.body.fechaFin;
    var id = req.body.proyecto;
    var codigos = req.body.codigo;
    var nombres = req.body.nombre;
    var direcciones = req.body.direccion;
    var servicios = req.body.servicio;
    var empresas = req.body.empresa;
    var roles = req.body.rol;
    var update = 'UPDATE proyectos SET fecha_inicial="' + fechai + '", fecha_final="' + fechaf + '" WHERE id="' + id + '"';
    for (var i = 0; i < tecnologias.length; i++) {
        if (tecnologias[i] != 'Seleccione una habilidad' && dedicaciones[i] != '') {
            var insert = 'INSERT INTO `staffing`(`id`, `codigo`, `nombre`, `direccion`, `servicio`, `empresa`, `proyecto`, `dedicacion`, `rol`, `tecnologia`) VALUES (null,"' + codigos[i] + '","' + nombres[i] + '","' + direcciones[i] + '","' + servicios[i] + '","' + empresas[i] + '","' + id + '","' + dedicaciones[i] + '","' + roles[i] + '","' + tecnologias[i] + '")';
            connect.conexion.query(insert, function (error, results, fields) {
                if (error) throw error;
            });
        }
    }
    connect.conexion.query(update, function (error, results, fields) {
        if (error) throw error;
        return res.redirect('/proyectos');
    });
});

router.get('/eliminar', function (req, res) {
    var id = req.body.id;
    connect.conexion.query("delete from staffing where id=?", [id], function (err, rows, fields) {

        if (!!err) {
            console.log('Error', +err);
        }
        else {
            console.log("Empleado eliminado");
            return res.redirect('/proyectos');
        }

    });

});

router.get('/inicio', function (req, res) {
    var consulta = ['SELECT id_direccion, direccion FROM parametros GROUP BY id_direccion',
                    'SELECT id, servicio FROM parametros'];
    connect.conexion.query(consulta.join(';'), function(error, results, fields){
        res.render('inicio', {direccion: JSON.parse(JSON.stringify(results[0])), servicio: JSON.parse(JSON.stringify(results[1]))});
    });
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    var codigo = req.body.codigo;
    var clave = req.body.clave;
    var credencial = 'SELECT codigo, password FROM usuarios where codigo=? AND password=?';
    connect.conexion.query(credencial, [codigo, clave], function (error, results, fields) {
        if (!!error) {
            console.log('Error', +error);
        }
        else if (results[0].codigo == undefined) {
            console.log("Usted no está registrado");
        }
        else if (results[0].password == undefined) {
            console.log("Contraseña invalida");
        } else
        {
            req.session.codigo = req.body.codigo;
            return res.redirect('/inicio');
        }
    });
});

router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.render('login');
});

module.exports = router;