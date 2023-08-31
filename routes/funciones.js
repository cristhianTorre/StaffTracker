var listado_proyectos = [];

/**
 * Muestra las personas a cargo y sus habilidades en las tecnologías del banco
 * @param {JSON} json 
 * @param {JSON} staffing 
 * @param {String} codigoJefe 
 * @returns 
 */
function nuevosIntegrantes(json, staffing, codigoJefe){
    let leerStaff = json;
    let nuevos = [];
    for(const itemFila of leerStaff){
        if(itemFila['superior'] == codigoJefe){
            nuevos.push({codigonew: itemFila['codigo'], nombrenew: itemFila['nombre'], dedicacionnew: 100 - estaOcupado(staffing, itemFila['codigo'])*100, color: obtenerColor(100 - estaOcupado(staffing, itemFila['codigo'])*100), direccion: itemFila['direccion'], servicio: itemFila['servicio'], empresa: itemFila['empresa'], tecnologianew: itemFila['tecnologia'], rolnew: itemFila['rol'], aso: Math.round(itemFila['ASO']), apx: Math.round(itemFila['APX']), cells: Math.round(itemFila['CELLS']), host: Math.round(itemFila['HOST']), bluespring: Math.round(itemFila['BLUESPRING']), python: Math.round(itemFila['PYTHON']), scala: Math.round(itemFila['SCALA'])});
        }
    }
    return nuevos;
}

/**
 * Obtiene los proyectos que están en el backlog (estado=stock)
 * @param {JSON} json 
 * @param {JSON} staffing 
 * @param {JSON} staff 
 * @param {String} jefe 
 * @returns 
 */
function getNewsProyectos(json, staffing, staff, jefe){
    let leerProyectos = json;
    let backlog = [];
    for(const itemFila of leerProyectos){
        if(itemFila['status'] == 'Stock'){
            backlog.push({id: itemFila['id'], ProjectIDName: itemFila['projectidname'], descripcion: itemFila['descripcion'], normativo: itemFila['normativo'], scrum: itemFila['scrum'], fecIni: conversion_fecha_inicial(itemFila['fecha_inicial']), fecFin: conversion_fecha_final(itemFila['fecha_final']), nuevos: nuevosIntegrantes(staff, staffing, jefe)});
        }
    }
    return backlog;
}

/**
 * Muestra los proyectos con sus respectivos empleados y cronograma
 * @param {JSON} json 
 * @param {JSON} proyecto 
 * @param {String} direccion 
 * @param {String} servicio 
 * @returns 
 */
function getProyectos(json, proyecto, direccion, servicio){
    let leerStaffing = json;
    let proyectos = [];
    let informacion = [];
    for(const itemFila of leerStaffing){
        if(itemFila['servicio'] == servicio && itemFila['direccion'] == direccion && getStatusFlow(proyecto, itemFila['proyecto'])){
            //console.log(itemFila['proyecto']);
            if(!(proyectos.includes(itemFila['proyecto']))){
                //console.log(itemFila['proyecto']);
                informacion.push(Object.assign(consultaInformacionProyecto(proyecto, itemFila['proyecto']), {emplo: getEmpleados(json, itemFila['proyecto'])}));
                proyectos.push(itemFila['proyecto']);
            }
        }
    }
    return informacion;
}

/**
 * Consulta si una persona está ocupada
 * @param {JSON} json 
 * @param {String} codigo 
 * @returns 
 */
function estaOcupado(json, codigo){
    let leerStaffing = json;
    var suma = 0;
    for(const itemFila of leerStaffing){
        if(itemFila['codigo'] == codigo){
            suma += itemFila['dedicacion'];
        }
    }
    return suma;
}

/**
 * Consulta si el proyecto tiene como estado Flow
 * @param {JSON} json 
 * @param {String} proyecto 
 * @returns 
 */
function getStatusFlow(json, proyecto){
    let leerProyectos = json;
    for(const itemFila of leerProyectos){
        if(itemFila['projectidname'] == proyecto && itemFila['status'] == 'Flow'){
            return true;
        }
    }
    return false;
}

/**
 * Obtiene el identificador del proyecto buscado
 * @param {JSON} json1 
 * @param {JSON} json2 
 * @param {String} proyecto 
 * @returns 
 */
function staffingProject(json1, json2, proyecto){
    let leerStaffing = json1;
    let leerProyectos = json2;
    for(const itemFila of leerStaffing){
        if(itemFila['proyecto'] == proyecto){
            for(const item of leerProyectos){
                if(item['projectidname'] == proyecto){
                    return item['id'];
                }
            }
        }
    }
}

/**
 * Revisa si el identificador del item se encuentra dentro del arreglo
 * @param {Number} proj 
 * @param {Array} arreg 
 * @returns 
 */
function inArreglo(proj,arreg){
    for(var i = 0; i<arreg.length; i++){
        if(Object.is(arreg[i], proj)){
            return false;
        }
    }
    return true;
}

/**
 * Obtiene los empleados del proyecto seleccionado
 * @param {JSON} json 
 * @param {String} proyecto 
 * @returns 
 */
function getEmpleados(json, proyecto){
    let leerStaffing = json;
    let empleados = [];
    for(const itemFila of leerStaffing){
        if(itemFila['proyecto'] == proyecto){
            empleados.push({codigo: itemFila['codigo'], nombre: itemFila['nombre'], dedicacion: itemFila['dedicacion']*100, tecnologia: itemFila['tecnologia'], rol: itemFila['rol']});
        }
    }
    return empleados;
}

/**
 * Obtiene la información del proyecto seleccionado
 * @param {JSON} json 
 * @param {String} proyecto 
 * @returns 
 */
function consultaInformacionProyecto(json, proyecto){
    let leerProyectos = json;
    let informacion = {};
    for(const itemFila of leerProyectos){
        if(itemFila['projectidname'] == proyecto){
            Object.assign(informacion,{id: itemFila['id'], projectIDName: itemFila['projectidname'], descripcion: itemFila['descripcion'], normativo: itemFila['normativo'], scrum: itemFila['scrum'], owner: itemFila['owner'], status: itemFila['status'], fecIni: conversion_fecha_inicial(itemFila['fecha_inicial']), fecFin: conversion_fecha_final(itemFila['fecha_final']), progreso: progreso(conversion_fecha_inicial(itemFila['fecha_inicial']), conversion_fecha_final(itemFila['fecha_final']))});
        }
    }
    return informacion;
}

/**
 * Obtiene las direcciones del banco
 * @param {JSON} json 
 * @returns 
 */
function getDirecciones(json){
    let leerParametros = json;
    let direcciones = [];
    let ids = [];
    for(const itemFila of leerParametros){
        if(inArreglo(itemFila['id_direccion'], ids)){
            direcciones.push({id: itemFila['id_direccion'],nombre: itemFila['direccion']});
            ids.push(itemFila['id_direccion']);
        }
    }
    return direcciones;
}

/**
 * Obtiene los servicios de cada una de las direcciones
 * @param {JSON} json 
 * @returns 
 */
function getServicios(json){
    let leerParametros = json;
    let servicios = [];
    for(const itemFila of leerParametros){
        servicios.push({nombre: itemFila['servicio'], id: itemFila['id']});
    }
    return servicios;
}


function getProyectosJefe(jefe){
    let proyectos = [];
    let informacion = [];
    for(const itemFila of leerStaffing){
        if(getBoss(itemFila['Código']) == jefe){
            if(inArreglo(staffingProject(itemFila['Proyecto']), proyectos)){
                informacion.push([getEmpleados(itemFila['Proyecto']), consultaInformacionProyecto(itemFila['Proyecto'])]);
                proyectos.push(staffingProject(itemFila['Proyecto']));
            }
        }
    }
    return informacion;
}

/**
 * Obtiene el jefe de la persona solicitada
 * @param {JSON} json 
 * @param {String} codigo 
 * @returns 
 */
function getBoss(json, codigo) {
    let leerStaff = json;
    for(const itemFila of leerStaff){
        if(itemFila['codigo'] == codigo){
            return itemFila['superior'];
        }
    }
    return 'No tiene jefe';
}

/**
 * Convierte el formato cuartil en la primera fecha del cuartil mencionado
 * @param {String} cuartil 
 * @returns 
 */
function conversion_fecha_inicial(cuartil){
    if(cuartil[0] == "1"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/01/01";
    }else if(cuartil[0] == "2"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/04/01";
    }else if(cuartil[0] == "3"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/07/01";
    }else if(cuartil[0] == "4"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/10/01";
    }
}

/**
 * Convierte el formato cuartil en la última fecha del cuartil mencionado
 * @param {String} cuartil 
 * @returns 
 */
function conversion_fecha_final(cuartil){
    if(cuartil[0] == "1"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/03/31";
    }else if(cuartil[0] == "2"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/06/30";
    }else if(cuartil[0] == "3"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/09/30";
    }else if(cuartil[0] == "4"){
        return cuartil.substring(cuartil.length - 4, cuartil.length) + "/12/31";
    }
}

/**
 * Obtiene el porcentaje del tiempo transcurrido de acuerdo a la fecha inicial y final
 * @param {String} fechaini 
 * @param {String} fechafin 
 * @returns 
 */
function progreso(fechaini, fechafin){
    let convertirini = new Date(fechaini).getTime();
    let convertirfin = new Date(fechafin).getTime();
    let tiempoTranscurrido = Date.now();
    let hoy = new Date(tiempoTranscurrido).getTime();
    let porcentaje = ((hoy-convertirini)/(convertirfin-convertirini))*100;
    return Math.round(porcentaje);
}

/**
 * Obtiene los proyectos y la dedicación del empleado asociada al mismo 
 * @param {JSON} staffing 
 * @param {JSON} principal 
 * @returns 
 */
function obtenerProyectos(staffing, principal){
    for(const itemFila of principal){
        let proyectos = [];
        for(const item of staffing){
            if(itemFila['codigo'] == item['codigo']){
                proyectos.push({proyecto: item['proyecto'], dedicacion: item['dedicacion']});
            }
        }
        itemFila.proyectos = proyectos;
    }
    return principal;
}

/**
 * Genera el número de color correspondiente al porcentaje marcado
 * @param {Number} porcentaje 
 * @returns 
 */
function obtenerColor(porcentaje){
    if(porcentaje <=  0){
        return '#F6775C';
    }else if(porcentaje < 40){
        return '#F6DC5C';
    }else{
        return '#5CF6A7';
    }
}

/**
 * Obtiene el cuartil de la fecha de hoy
 * @returns 
 */
function getQuartilHoy(){
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const year = hoy.getFullYear();
    const mes = hoy.getMonth() + 1;
    if(mes < 4){
        return "1Q "+year.toString();
    }else if(mes < 7){
        return "2Q "+year.toString();
    }else if(mes < 10){
        return "3Q "+year.toString();
    }else{
        return "4Q "+year.toString();
    }
}

/**
 * Revisa si el cuartil marcado está entre los cuartiles inicial y final
 * @param {String} inicio 
 * @param {String} fin 
 * @param {String} cuartil 
 * @returns 
 */
function entreCuartiles(inicio, fin, cuartil){
    let listadoCuartiles = obtenerListadoCuartiles(inicio, fin);
    if(listadoCuartiles.includes(cuartil)){
        return true;
    }else{
        return false;
    }
}

function obtenerListadoCuartiles(inicio, fin){
    let yearIni = parseInt(inicio.substring(inicio.length - 4, inicio.length));
    let cuartilIni = parseInt(inicio[0]);
    let listadoCuartiles = [inicio];
    while(true){
        if(listadoCuartiles.includes(fin)){
            break;
        }else if(cuartilIni == 4){
            cuartilIni = 1;
            yearIni += 1;
        }else{
            cuartilIni += 1;
        }
        listadoCuartiles.push(cuartilIni.toString()+"Q "+yearIni.toString());
    }
    return listadoCuartiles;
}

function obtenerSextoCuartil(cuartil){
    const valorCuartil = cuartil[0];
    const year = parseInt(valorCuartil.substring(valorCuartil.length - 4, valorCuartil.length));
    const cuartilSexto = '';
    const yearNew = '';
    switch(cuartil){
        case 1:
            cuartilSexto = '2';
            yearNew = (year + 1).toString();
            break;
        case 2:
            cuartilSexto = '3';
            yearNew = (year + 1).toString();
            break;
        case 3:
            cuartilSexto = '4';
            yearNew = (year + 1).toString();
            break;
        case 4:
            cuartilSexto = '1';
            yearNew = (year + 2).toString();
            break;
    }
    const fecha = cuartilSexto+"Q "+yearNew;
    return fecha;
}

function obtenerOcupacionByQuartil(staffing, proyectos, codigo, cuartil){
    //const cuartilHoy = getQuartilHoy();
    const fecha = obtenerSextoCuartil(cuartil);
    let listado = obtenerListadoCuartiles(cuartil, fecha);
    let ocupacionCuartiles = [0,0,0,0,0,0];
    for(const itemFila of staffing){
        if(itemFila['codigo'] == codigo){
            for(const item of proyectos){
                if(item['projectidname'] == itemFila['proyecto']){
                    for(var i = 0; i<listado.length; i++){
                        if(entreCuartiles(item['fecha_inicial'], item['fecha_final'], listado[i])){
                            ocupacionCuartiles[i] += itemFila['dedicacion'];
                        }
                    }
                }
            }
        }
    }
    return ocupacionCuartiles;
}

function obtenerTercerQuartil(cuartil){
    const valorCuartil = cuartil.charAt(0);
    const year = parseInt(cuartil.substring(cuartil.length - 4, cuartil.length));
    switch(valorCuartil){
        case '1':
            return '3Q '+(year-1).toString();
        case '2':
            return '4Q '+(year-1).toString();
        case '3':
            return '1Q '+year.toString();
        case '4':
            return '2Q '+year.toString();
    }
}

function obtenerTercerProximoQuartil(cuartil){
    const valorCuartil = cuartil.charAt(0);
    const year = parseInt(cuartil.substring(cuartil.length - 4, cuartil.length));
    switch(valorCuartil){
        case '1':
            return '4Q '+year.toString();
        case '2':
            return '1Q '+(year + 1).toString();
        case '3':
            return '2Q '+(year + 1).toString();
        case '4':
            return '3Q '+(year + 1).toString();
    }
}

function getCuartilesEncabezado(){
    const cuartilHoy = getQuartilHoy();
    const fecha_inicio = obtenerTercerQuartil(cuartilHoy);
    const fecha = obtenerTercerProximoQuartil(cuartilHoy);
    let listado = obtenerListadoCuartiles(fecha_inicio, fecha);
    let map = {primero:listado[0], segundo:listado[1], tercero:listado[2], cuarto:listado[3], quinto:listado[4], sexto:listado[5], year: new Date(Date.now()).getFullYear()};
    return map;
}

function getQuartilFecha(fecha){
    const hoy = new Date(fecha);
    const year = hoy.getFullYear();
    const mes = hoy.getMonth() + 1;
    if(mes < 4){
        return "1Q "+year.toString();
    }else if(mes < 7){
        return "2Q "+year.toString();
    }else if(mes < 10){
        return "3Q "+year.toString();
    }else{
        return "4Q "+year.toString();
    }
}

function organizarPersonas(proyectos, reglas){
    for(const proyecto of proyectos){
        proyecto.reglas = unirReglas(reglas, proyecto['project'].feature_codigo);
        const cronograma = cronogramaFeature(proyecto['project'].fecha_inicio, proyecto['project'].fecha_fin);
        proyecto.quartil_uno = cronograma.primero;
        if(cronograma.primero == 100){
            proyecto.borde_uno = "indicadorCronogramaFull";
        }else{
            proyecto.borde_uno = "indicadorCronogramaEmpty";
        }
        proyecto.quartil_dos = cronograma.segundo;
        if(cronograma.segundo == 100){
            proyecto.borde_dos = "indicadorCronogramaFull";
        }else{
            proyecto.borde_dos = "indicadorCronogramaEmpty";
        }
        if(cronograma.cuarto == 100){
            proyecto.borde_cuatro = "indicadorCronogramaFull";
        }else{
            proyecto.borde_cuatro = "indicadorCronogramaEmpty";
        }
        if(cronograma.quinto == 100){
            proyecto.borde_cinco = "indicadorCronogramaFull";
        }else{
            proyecto.borde_cinco = "indicadorCronogramaEmpty";
        }
        if(cronograma.sexto == 100){
            proyecto.borde_seis = "indicadorCronogramaFull";
        }else{
            proyecto.borde_seis = "indicadorCronogramaEmpty";
        }
        proyecto.progreso = progreso(conversion_fecha_inicial(getQuartilHoy()), conversion_fecha_final(getQuartilHoy()));
    }
    return proyectos;
}

function cronogramaFeature(f_inicial, f_final){
    const q_inicial = getQuartilFecha(f_inicial);
    const q_final = getQuartilFecha(f_final);
    let listado = obtenerListadoCuartiles(q_inicial, q_final);
    let cronograma = getCuartilesEncabezado();
    let porcentajes = {primero:0, segundo:0}
    if(listado.includes(cronograma.primero)){
        porcentajes.primero = 100;
    }
    if(listado.includes(cronograma.segundo)){
        porcentajes.segundo = 100;
    }
    if(listado.includes(cronograma.cuarto)){
        porcentajes.cuarto = 100;
    }
    if(listado.includes(cronograma.quinto)){
        porcentajes.quinto = 100;
    }
    if(listado.includes(cronograma.sexto)){
        porcentajes.sexto = 100;
    }
    return porcentajes;
}


function proyectosConJefe(proyectos, jefe, personas, usuarios){
    for(const persona of personas){
        if(persona['superior'] == jefe && !esJefe(usuarios, persona['codigo'])){
            getProjects(proyectos, persona, jefe);
        }else if(persona['superior'] == jefe){
            proyectosConJefe(proyectos, persona['codigo'], personas, usuarios);
        }
    }
    return listado_proyectos;
}

function esJefe(usuarios, persona){
    for(const usuario of usuarios){
        if(usuario['codigo'] == persona){
            return true;
        }
    }
    return false;
}

function getProjects(proyectos, persona, jefe){
    for(const proyecto of proyectos){
        if(proyecto['persona_codigo'] == persona['codigo']){
            let verificar = inListadoProyectos(proyecto);
            if(verificar[0]){
                persona.ocupacion = proyecto['ocupacion'];
                persona.habilidad = proyecto['habilidad_nombre'];
                listado_proyectos[verificar[1]].people.push(persona);
            }else{
                persona.ocupacion = proyecto['ocupacion'];
                persona.habilidad = proyecto['habilidad_nombre'];
                listado_proyectos.push({boss: jefe, project: proyecto, people: [persona]});
                //feature_codigo: proyecto['feature_codigo'], feature_nombre:proyecto['feature_nombre'], proyecto: proyecto['proyecto'], estado: proyecto['estado'], fecha_inicio:proyecto['fecha_inicio'], fecha_fin:proyecto['fecha_fin']
            }
        }
    }
}

function inArregloPersonas(arreglo, codigo){
    for(let i = 0; i<arreglo.length; i++){
        if(arreglo[i].codigo == codigo){
            return true;
        }
    }
    return false;
}

function inListadoProyectos(proyecto){
    for(let i = 0; i<listado_proyectos.length; i++){
        if(listado_proyectos[i].project['feature_codigo']==proyecto['feature_codigo']){
            return [true, i];
        }
    }
    return [false, 0];
}

function unirReglas(reglas, proyecto){
    const arreglo = [];
    for(const regla of reglas){
        if(regla['feature'] == proyecto){
            if(regla['cumple'] == 1){
                regla.clase = "table-success";
            }else{
                regla.clase = "table-danger";
            }
            arreglo.push(regla);
        }
    }
    return arreglo;
}

module.exports = {getProyectos, getNewsProyectos, getDirecciones, getServicios, obtenerProyectos, getCuartilesEncabezado, organizarPersonas, proyectosConJefe};