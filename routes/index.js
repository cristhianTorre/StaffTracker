var express = require('express');
var router = express.Router();
var funciones = require('./funciones');
const connect = require('./connect');
const cron = require('node-cron');
const reglas = require('./businessRules');

/*
 * Redirecciona la página para que haya un logueo de parte del usuario 
 */
router.get('/', function(req, res){
    return res.redirect('/login');
});

/*
 * Carga la página de proyectos accediendo a la base de datos
 */

router.get('/proyectos', function (req, res) {
    var jefe = req.session.mail;
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

/*
 * Carga proyectos de acuerdo a la dirección y servicio seleccionado
 */

router.post('/proyectos-post', function (req, res) {
    var jefe = req.session.mail;
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

/*
 * Enviar proyectos del backlog a proyectos en curso
 */

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


/*
 * Carga la pagina de personas
 */

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


/*
 * Carga la página de personas de acuerdo a la dirección y servicio seleccionado
 */

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


/*
 * Envía los empleados al empleado seleccionado
 * Actualiza la fecha de inicio y fin del proyecto seleccionado
 */

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

/*
 * Elimina un miembro del proyecto seleccionado 
 */

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

/*
 * Carga la página de inicio 
 */

router.get('/inicio', function (req, res) {
    var consulta = ['SELECT id_direccion, direccion FROM parametros GROUP BY id_direccion',
                    'SELECT id, servicio FROM parametros'];
    connect.conexion.query(consulta.join(';'), function(error, results, fields){
        res.render('inicio', {direccion: JSON.parse(JSON.stringify(results[0])), servicio: JSON.parse(JSON.stringify(results[1]))});
    });
});

/*
 * Carga la página de logueo
 */

router.get('/login', function (req, res, next) {
    res.render('login');
});

/*
 * Hace la validación correspondiente al correcto logueo del usuario 
 */

router.post('/login', function (req, res, next) {
    var codigo = req.body.mail;
    var clave = req.body.clave;
    var credencial = 'SELECT codigo, clave FROM usuarios where codigo=? AND clave=?';
    connect.conexion.query(credencial, [codigo, clave], function (error, results, fields) {
        if (!!error) {
            console.log('Error', +error);
        }
        else if (results[0].codigo == undefined) {
            console.log("Usted no está registrado");
        }
        else if (results[0].clave == undefined) {
            console.log("Contraseña invalida");
        } else
        {
            req.session.mail = req.body.mail;
            return res.redirect('/features');
        }
    });
});

/*
 * Cierra la sesión iniciada por el usuario
 */

router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.render('login');
});

/*
 * Carga los gráficos de la página de inicio 
 */

router.post('/direccion', function (req,res,next) {
    var direccion = req.body.direccion;
    var consulta = ['SELECT id_direccion, direccion FROM parametros GROUP BY id_direccion',
                    'SELECT id, servicio FROM parametros',
                    'SELECT count(proyecto) as `cantidades`, servicio FROM `staffing` WHERE direccion=? GROUP BY servicio ORDER BY servicio'];
    connect.conexion.query(consulta.join(';'), [direccion], function (error, results, fields){
        if (error) throw error;
        const json = JSON.parse(JSON.stringify(results[2]));
        let service = [];
        let servicio ='';
        let cantidad = [];
        for(const item of json){
            servicio += '"'+item['servicio']+'"'+',';
            service.push(item['servicio']);
            cantidad.push(item['cantidades']);
        }
        const cadena = servicio.substring(servicio.length-1,']');
        let anexar = '<!doctype html><html><head></head><body><canvas id="serviciosChart"></canvas><script>const ctx = document.getElementById("serviciosChart");new Chart(ctx, {type: "bar", data: {labels: ['+cadena+'], datasets: [{label: "Cantidad de Proyectos",data: ['+cantidad.toString()+'],backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],borderWidth: 1}]},options: {indexAxis: "y",scales: {y: {beginAtZero: true}}}});</script><script src="https://cdn.jsdelivr.net/npm/chart.js"></script></body></html>';
        res.render("inicio", {servicios:service, cantidades:cantidad, direccion: JSON.parse(JSON.stringify(results[0])), servicio: JSON.parse(JSON.stringify(results[1]))});
    });
});

router.get('/features', function (req,res,next){
    let jefe = req.session.mail;
    const cuartiles = funciones.getCuartilesEncabezado();
    let features_proyectos = 'SELECT features.codigo AS "feature_codigo", features.nombre AS "feature_nombre", features.proyecto, features.estado, features.fecha_inicio, features.fecha_fin FROM features INNER JOIN staffing ON features.codigo = staffing.feature INNER JOIN personas ON personas.codigo = staffing.persona INNER JOIN habilidades ON staffing.tecnologia = habilidades.id WHERE personas.superior = ? AND features.estado != "Closed" GROUP BY features.id AND features.fecha_inicio <= CURDATE() AND features.fecha_fin >= CURDATE()';
    let features_consulta = 'SELECT features.codigo AS "feature_codigo", features.nombre AS "feature_nombre", features.proyecto, features.estado, personas.codigo AS "persona_codigo", personas.nombre AS "persona_nombre", habilidades.nombre AS "habilidad_nombre", staffing.ocupacion, personas.rol FROM features INNER JOIN staffing ON features.codigo = staffing.feature INNER JOIN personas ON personas.codigo = staffing.persona INNER JOIN habilidades ON staffing.tecnologia = habilidades.id WHERE personas.superior = ? AND features.estado != "Closed" AND features.fecha_inicio <= CURDATE() AND features.fecha_fin >= CURDATE()';
    let personas_equipo = 'SELECT * FROM personas WHERE superior = ?';
    let proyectos_general = 'SELECT features.codigo AS "feature_codigo", features.nombre AS "feature_nombre", features.proyecto, features.estado, features.fecha_inicio, features.fecha_fin, staffing.persona AS "persona_codigo", habilidades.nombre AS "habilidad_nombre", staffing.ocupacion FROM features INNER JOIN staffing ON features.codigo = staffing.feature INNER JOIN personas ON personas.codigo = staffing.persona INNER JOIN habilidades ON staffing.tecnologia = habilidades.id WHERE features.estado != "Closed" AND features.fecha_inicio <= CURDATE() AND features.fecha_fin >= CURDATE()';
    let personas_general = 'SELECT * FROM personas';
    let usuarios = 'SELECT * FROM usuarios';
    let usuario = 'SELECT * FROM usuarios WHERE codigo = ?';
    let reglas_c = 'SELECT * FROM reglas_asociadas INNER JOIN reglas_de_oro ON reglas_asociadas.regla = reglas_de_oro.id'
    let consultas = [features_consulta, personas_equipo, features_proyectos, proyectos_general, personas_general, usuarios, usuario, reglas_c];
    connect.conexion.query(consultas.join(';'), [jefe, jefe, jefe, jefe], function (error, results, fields){
        let resultadoUno = JSON.parse(JSON.stringify(results[0]));
        let resultadoDos = JSON.parse(JSON.stringify(results[1]));
        let resultadoTres = JSON.parse(JSON.stringify(results[2]));
        let resultadoCuatro = JSON.parse(JSON.stringify(results[3]));
        let resultadoCinco = JSON.parse(JSON.stringify(results[4]));
        let resultadoSeis = JSON.parse(JSON.stringify(results[5]));
        let usuario_login = JSON.parse(JSON.stringify(results[6]));
        let reglas = JSON.parse(JSON.stringify(results[7]));
        for(let proyecto of resultadoTres){
            proyecto.equipo = resultadoDos;
        }
        const manipulacion = funciones.proyectosConJefe(resultadoCuatro, jefe, resultadoCinco, resultadoSeis);
        res.render("personasST", {login: usuario_login, features: funciones.organizarPersonas(manipulacion, reglas), habilidades: resultadoDos, qtiles: cuartiles});
    });
});

cron.schedule("* * * * *", function () {
    //reglas.set_internos_externos_cero();
    //reglas.set_ocupacion_cero();
    let tablas = ['SELECT * FROM staffing',
                'SELECT * FROM features',
                'SELECT * FROM personas',
                'SELECT * FROM porcentajes_asociados',
                'SELECT * FROM requisitos'];
    connect.conexion.query(tablas.join(';'), function (error, results, fields) {
        const staffing = JSON.parse(JSON.stringify(results[0]));
        const features = JSON.parse(JSON.stringify(results[1]));
        const personas = JSON.parse(JSON.stringify(results[2]));
        const porcentajes = JSON.parse(JSON.stringify(results[3]));
        const requisitos = JSON.parse(JSON.stringify(results[4]));
        reglas.actualizar_ocupacion_actual(staffing, features, personas);
        reglas.actualizar_internos_externos_features(staffing, features, personas);
        for(const feature of features){
            if(feature['scrum'] == 1){
                reglas.regla_numero_siete(feature, features, staffing);
            }
            reglas.regla_numero_uno(feature);
            reglas.regla_numero_tres(staffing, personas, feature);
            reglas.regla_numero_cuatro(feature);
            reglas.regla_numero_cinco(feature);
            reglas.regla_numero_seis(feature, staffing, porcentajes);
            reglas.regla_numero_ocho(feature, requisitos, staffing);
        }
        //regla 2 de todas las features
        reglas.codigosStaffinActual(staffing, features);
    });
  });

cron.schedule("40 * * * *", function (){
    let tablas = ['SELECT * FROM features',
    'SELECT * FROM reglas_asociadas',
    'SELECT * FROM reglas_de_oro',
    'SELECT * FROM requisitos',
    'SELECT * FROM habilidades'];
    connect.conexion.query(tablas.join(';'), function (error, results, fields) {
        const features = JSON.parse(JSON.stringify(results[0]));
        const reglas_asociadas = JSON.parse(JSON.stringify(results[1]));
        const reglas_de_oro = JSON.parse(JSON.stringify(results[2]));
        const requisitos = JSON.parse(JSON.stringify(results[3]));
        const habilidades = JSON.parse(JSON.stringify(results[4]));
        reglas.insercion_reglas_asociadas(features, reglas_asociadas, reglas_de_oro);
        reglas.insercion_requisitos_features(features, requisitos, habilidades);
    });
});

module.exports = router;