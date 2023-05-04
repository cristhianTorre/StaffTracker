var express = require('express');
var router = express.Router();
var hbs = require('hbs');
var funciones = require('./funciones');
//const connect = require('connect');

router.get('/', function(req, res){

    var html = {proyectos: funciones.getProyectos('CORE','Cross/Gestor documental y SSDD'), backlog: funciones.getNewsProyectos(), direccion: funciones.getDirecciones()};
    res.render('index', html);
});

router.post('/', function(req, res){
    var body = req.body;
    var codigo = body.codigo;
    var proyecto = body.proyecto;
    var dedicacion = body.dedicacion;
    var res_option = {opcion: funciones.getServicios(body.opcion)}
    res.render('index', res_option);
});

router.get('/proyectos-elkin', function(req, res){
    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><style>*{margin: 0;padding: 0;}.generalContainer{margin: 30px 30px 0 30px;}.containerProjectCourse{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0px 30px 0 30px;background-color: rgba(147, 248, 147, 0.788);}.containerProject{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;margin: 2px;background-color: white;}.cardProyecto{border-right: 1px dashed rgb(203, 231, 255);height: 250px;}.titles{font-size:small;height: 14px;margin: 8px 0 8px 0;}#listProject{font-weight: bolder;font-size:x-small;list-style: none;padding: 0;margin-left: 10px;}.persons{height: 140px;background-color: white;}.listPerson, .listTrimestre{display: inline-flex;}.itemListPerson{width: 120px;padding: 0px;list-style: none;text-align: center;}.itemListTrimestre{width: 25%;padding: 0px;list-style: none;text-align: center;}.person{font-size:x-small;}.personCode{margin: 0;}.imagePerson{width: auto;height: 50px;border-radius: 25px;}.containerSchedule{border-top: 1px dashed rgb(203, 231, 255);border-radius: 4px;height: 120px;background-color: white;}.containerProjectBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0 30px 30px 30px;background-color: rgb(250, 93, 93);}.containerBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: 120px;margin: 2px;background-color: white;}</style><title>Front01</title></head>';
    html += '<body><div class="generalContainer"><div class="containerProjectCourse">' + pintarProyectoJefe() + '<div class="containerProjectBacklog"><div class="containerBacklog"><h2 id="titleProject" class="titles">Backlog: </h2></div></div></div></div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script></body></html>'; 
    //res.send(html);

});

module.exports = router;