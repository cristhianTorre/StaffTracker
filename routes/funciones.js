

//Mostrar listado de personas acargo
function nuevosIntegrantes(json, staffing, codigoJefe){
    let leerStaff = json;
    let nuevos = [];
    for(const itemFila of leerStaff){
        if(itemFila['superior'] == codigoJefe){
            nuevos.push({codigonew: itemFila['codigo'], nombrenew: itemFila['nombre'], dedicacionnew: estaOcupado(staffing, itemFila['codigo'])*100, direccion: itemFila['direccion'], servicio: itemFila['servicio'], empresa: itemFila['empresa'], tecnologianew: itemFila['tecnologia'], rolnew: itemFila['rol'], aso: Math.round(itemFila['ASO']), apx: Math.round(itemFila['APX']), cells: Math.round(itemFila['CELLS']), host: Math.round(itemFila['HOST']), bluespring: Math.round(itemFila['BLUESPRING']), python: Math.round(itemFila['PYTHON']), scala: Math.round(itemFila['SCALA'])});
        }
    }
    return nuevos;
}

//Backlog
function getNewsProyectos(json, staffing, staff){
    let leerProyectos = json;
    let backlog = [];
    for(const itemFila of leerProyectos){
        if(itemFila['status'] == 'Stock'){
            backlog.push({id: itemFila['id'], ProjectIDName: itemFila['projectidname'], descripcion: itemFila['descripcion'], normativo: itemFila['normativo'], scrum: itemFila['scrum'], fecIni: itemFila['fecha_inicial'], fecFin: itemFila['fecha_final'], nuevos: nuevosIntegrantes(staff, staffing, 'C797459')});
        }
    }
    return backlog;
}

//Staffing - proyectos con sus respectivos empleados y cronograma
function getProyectos(json, staff, proyecto, direccion, servicio){
    let leerStaffing = json;
    let proyectos = [];
    let informacion = [];
    let diagramapersonas = [];
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

function getStatusFlow(json, proyecto){
    let leerProyectos = json;
    for(const itemFila of leerProyectos){
        if(itemFila['projectidname'] == proyecto && itemFila['status'] == 'Flow'){
            return true;
        }
    }
    return false;
}

function staffingProject(json1, json2, proyecto){
    let leerStaffing = json1;
    let leerProyectos = json2;
    console.log(proyecto);
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

function inArreglo(proj,arreg){
    for(var i = 0; i<arreg.length; i++){
        if(Object.is(arreg[i], proj)){
            return false;
        }
    }
    return true;
}

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

function consultaInformacionProyecto(json, proyecto){
    let leerProyectos = json;
    let informacion = {};
    for(const itemFila of leerProyectos){
        if(itemFila['projectidname'] == proyecto){
            Object.assign(informacion,{id: itemFila['id'], projectIDName: itemFila['projectidname'], descripcion: itemFila['descripcion'], normativo: itemFila['normativo'], scrum: itemFila['scrum'], owner: itemFila['owner'], status: itemFila['status'], fecIni: itemFila['fecha_inicial'], fecFin: itemFila['fecha_final']});
        }
    }
    return informacion;
}

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

//Obtener el jefe 
function getBoss(json, codigo) {
    let leerStaff = json;
    for(const itemFila of leerStaff){
        if(itemFila['codigo'] == codigo){
            return itemFila['superior'];
        }
    }
    return 'No tiene jefe';
}


function staffingProject(json1, json2, proyecto){
    let leerStaffing =  json1;
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


module.exports = {getProyectos, getNewsProyectos, getDirecciones, getServicios};