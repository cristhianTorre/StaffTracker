const xlsx = require('xlsx');
const connect = require('./connect');
/*const proyectos_json = proyectosBD(connect);
const staffing_json = staffingBD(connect);
const staff_json = staffBD(connect);
const parametros_json = parametrosBD(connect);*/
const worbook = xlsx.readFile('staffingSystems.xlsx');
const sheet_name_list = worbook.SheetNames;
const parametro = sheet_name_list[0];
const project = sheet_name_list[1];
const staff = sheet_name_list[2];
const staffing = sheet_name_list[3];
const leerStaff = xlsx.utils.sheet_to_json(worbook.Sheets[staff]);
const leerStaffing = xlsx.utils.sheet_to_json(worbook.Sheets[staffing]);
const leerProyectos = xlsx.utils.sheet_to_json(worbook.Sheets[project]);
const leerParametros = xlsx.utils.sheet_to_json(worbook.Sheets[parametro]);

/*
Conexion a base de datos y conversion de tablas a json


function proyectosBD(connection){
    let consulta = connection.query('SELECT * FROM proyectos');
    return consulta;
}

function staffingBD(connection){
    let consulta = connection.query('SELECT * FROM staffing');
    return consulta;
}

function staffBD(connection){
    let consulta = connection.query('SELECT * FROM staff');
    return consulta;
}

function parametrosBD(connection){
    let consulta = connection.query('SELECT * FROM parametros');
    return consulta;
}*/

//Mostrar listado de personas acargo
function nuevosIntegrantes(codigoJefe){
    let nuevos = [];
    for(const itemFila of leerStaff){
        if(itemFila['SUPERIOR'] == codigoJefe){
            nuevos.push({codigonew: itemFila['Código'], nombrenew: itemFila['Nombre'], dedicacionnew: estaOcupado(itemFila['Código'])*100, tecnologianew: itemFila['TECNOLOGÌA'], rolnew: itemFila['ROL'], aso: Math.round(itemFila['ASO']), apx: Math.round(itemFila['APX']), cells: Math.round(itemFila['CELLS']), host: Math.round(itemFila['HOST']), bluespring: Math.round(itemFila['BLUESPRING']), python: Math.round(itemFila['PYTHON']), scala: Math.round(itemFila['SCALA'])});
        }
    }
    return nuevos;
}

//Backlog
function getNewsProyectos(){
    let backlog = [];
    for(const itemFila of leerProyectos){
        if(itemFila['Status'] == 'Stock'){
            backlog.push({ProjectIDName: itemFila['Project ID Name'], descripcion: itemFila['Description (What & Where)'], normativo: itemFila['NORMATIVO'], scrum: itemFila['scrum'], fecIni: itemFila['Start Date'], fecFin: itemFila['End date'], nuevos: nuevosIntegrantes('C797459')});
        }
    }
    return backlog;
}

//Staffing - proyectos con sus respectivos empleados y cronograma
function getProyectos(direccion, servicio){
    let proyectos = [];
    let informacion = [];
    for(const itemFila of leerStaffing){
        if(itemFila['Servicio'] == servicio && itemFila['Dirección'] == direccion && getStatusFlow(itemFila['Proyecto'])){
            if(inArreglo(staffingProject(itemFila['Proyecto']), proyectos)){
                informacion.push(Object.assign(consultaInformacionProyecto(itemFila['Proyecto']), {emplo: getEmpleados(itemFila['Proyecto'])}));
                proyectos.push(staffingProject(itemFila['Proyecto']));
            }
        }
    }
    return informacion;
}

function estaOcupado(codigo){
    var suma = 0;
    for(const itemFila of leerStaffing){
        if(itemFila['Código'] == codigo){
            suma += itemFila['Dedicación'];
        }
    }
    return suma;
}

function getStatusFlow(proyecto){
    for(const itemFila of leerProyectos){
        if(itemFila['Project ID Name'] == proyecto && itemFila['Status'] == 'Flow'){
            return true;
        }
    }
    return false;
}

function staffingProject(proyecto){
    for(const itemFila of leerStaffing){
        if(itemFila['Proyecto'] == proyecto){
            for(const item of leerProyectos){
                if(item['Project ID Name'] == proyecto){
                    return item['ID'];
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

function getEmpleados(proyecto){
    let empleados = [];
    for(const itemFila of leerStaffing){
        if(itemFila['Proyecto'] == proyecto){
            empleados.push({codigo: itemFila['Código'], nombre: itemFila['Nombre'], dedicacion: itemFila['Dedicación']*100, tecnologia: itemFila['TECNOLOGÌA'], rol: itemFila['ROL']});
        }
    }
    return empleados;
}

function consultaInformacionProyecto(proyecto){
    let informacion = {};
    for(const itemFila of leerProyectos){
        if(itemFila['Project ID Name'] == proyecto){
            Object.assign(informacion,{ProjectIDName: itemFila['Project ID Name'], descripcion: itemFila['Description (What & Where)'], normativo: itemFila['NORMATIVO'], scrum: itemFila['scrum'], owner: itemFila['Project / Product Owner'], status: itemFila['Status'], fecIni: itemFila['Start Date'], fecFin: itemFila['End date']});
        }
    }
    return informacion;
}

function getDirecciones(){
    let direcciones = [];
    let ids = [];
    for(const itemFila of leerParametros){
        if(inArreglo(itemFila['id'], ids)){
            direcciones.push({nombre: itemFila['Dirección']});
            ids.push(itemFila['id']);
        }
    }
    return direcciones;
}

//Modificar celda en Staffing
function modifyDedicacion(codigo, proyecto, dedicacion){
    // editar una celda específica en una hoja de Excel 
    var aspose = aspose || {};
    // crear un objeto de la clase Cells.
    aspose.cells = require("aspose.cells");
    // instancia la clase secundaria WorkBook con un archivo XLSX 
    var sampleFile = "staffingSystems - copia.xlsx";
    var workbook = new aspose.cells.Workbook(sampleFile);
    // Acceda al libro de trabajo, obtenga las celdas llamando al método getCells () y llame al método putValue (cadena) para actualizar una celda específica (B2) de la hoja de Excel 
    for(var i = 2; i<100; i++){
        //console.log(console.log(workbook.getWorksheets().get(i).getCells().get("A"+i).getValue()));
        if(workbook.getWorksheets().get(3).getCells().get("A"+i).getValue()==codigo && workbook.getWorksheets().get(3).getCells().get("G"+i).getValue() == proyecto){
            //console.log(workbook.getWorksheets().get(3).getCells().get("H"+ide).getValue());
            workbook.getWorksheets().get(3).getCells().get("H"+i).putValue(dedicacion);
            //console.log(workbook.getWorksheets().get(3).getCells().get("H"+ide).getValue());
        }
    }
    // guardar los datos en un nuevo archivo xlsx
    workbook.save("staffingSystems - copia.xlsx");
}

function estaOcupado(codigo){
    var suma = 0;
    for(const itemFila of leerStaffing){
        if(itemFila['Código'] == codigo){
            suma += itemFila['Dedicación'];
        }
    }
    return suma;
}


//Asignar persona a un proyecto
function asignarPersona(codigo, proyecto, dedicacion, rol, tecnologia, comentarios){
    //Agregar la validacion la dedicacion
    var ocupacion = estaOcupado(codigo);
    if(ocupacion < 0.9 && ocupacion + dedicacion <= 1){
        var aspose = aspose || {};
        aspose.cells = require("aspose.cells");
        var sampleFile = "staffingSystems - copia.xlsx";
        var workbook = new aspose.cells.Workbook(sampleFile);
        var lista = getInformacion(codigo);
        i = getLength(leerStaffing) + 2;
        workbook.getWorksheets().get(3).getCells().get("A"+i).putValue(lista[0]); 
        workbook.getWorksheets().get(3).getCells().get("B"+i).putValue(lista[1]);
        workbook.getWorksheets().get(3).getCells().get("C"+i).putValue(lista[2]);
        workbook.getWorksheets().get(3).getCells().get("D"+i).putValue(lista[3]);
        workbook.getWorksheets().get(3).getCells().get("E"+i).putValue(lista[4]);
        workbook.getWorksheets().get(3).getCells().get("G"+i).putValue(proyecto);
        workbook.getWorksheets().get(3).getCells().get("H"+i).putValue(dedicacion);
        workbook.getWorksheets().get(3).getCells().get("I"+i).putValue(rol);
        workbook.getWorksheets().get(3).getCells().get("J"+i).putValue(tecnologia);
        workbook.getWorksheets().get(3).getCells().get("K"+i).putValue(comentarios);
        workbook.save("staffingSystems - copia.xlsx");
    }else{
        console.log("Este empleado está ocupado");
    }
}

function save(proyecto){
    var aspose = aspose || {};
    aspose.cells = require("aspose.cells");
    var sampleFile = "staffingSystems.xlsx";
    var workbook = new aspose.cells.Workbook(sampleFile);
    for(var i = 2; i<getLength(leerProyectos); i++){
        workbook.getWorksheets().get(4).getCells().get("H"+i).putValue('Flow');
    }
    workbook.save("staffingSystems - copia.xlsx");
}

function getLength(documento){
    var i = 0;
    for(const item of documento){
        if(item['ProjectIDName'] !== undefined){
            i += 1;
        }
    }
    return i;
}

function getServicios(direccion){
    let servicios = [];
    for(const itemFila of leerParametros){
        if(itemFila['Dirección'] == direccion){
            servicios.push({nombre: itemFila['Servicio']});
        }
    }
    return servicios;
}

//Modificar celda en Staffing
function modifyDedicacion(codigo, proyecto, dedicacion){
    // editar una celda específica en una hoja de Excel 
    var aspose = aspose || {};
    // crear un objeto de la clase Cells.
    aspose.cells = require("aspose.cells");
    // instancia la clase secundaria WorkBook con un archivo XLSX 
    var sampleFile = "staffingSystems - copia.xlsx";
    var workbook = new aspose.cells.Workbook(sampleFile);
    // Acceda al libro de trabajo, obtenga las celdas llamando al método getCells () y llame al método putValue (cadena) para actualizar una celda específica (B2) de la hoja de Excel 
    for(var i = 2; i<100; i++){
        //console.log(console.log(workbook.getWorksheets().get(i).getCells().get("A"+i).getValue()));
        if(workbook.getWorksheets().get(3).getCells().get("A"+i).getValue()==codigo && workbook.getWorksheets().get(3).getCells().get("G"+i).getValue() == proyecto){
            //console.log(workbook.getWorksheets().get(3).getCells().get("H"+ide).getValue());
            workbook.getWorksheets().get(3).getCells().get("H"+i).putValue(dedicacion);
            //console.log(workbook.getWorksheets().get(3).getCells().get("H"+ide).getValue());
        }
    }
    // guardar los datos en un nuevo archivo xlsx
    workbook.save("staffingSystems - copia.xlsx");
}

function estaOcupado(codigo){
    var suma = 0;
    for(const itemFila of leerStaffing){
        if(itemFila['Código'] == codigo){
            suma += itemFila['Dedicación'];
        }
    }
    return suma;
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
function getBoss(codigo) {
    for(const itemFila of leerStaff){
        if(itemFila['Código'] == codigo){
            return itemFila['SUPERIOR'];
        }
    }
    return 'No tiene jefe';
}


function staffingProject(proyecto){
    for(const itemFila of leerStaffing){
        if(itemFila['Proyecto'] == proyecto){
            for(const item of leerProyectos){
                if(item['Project ID Name'] == proyecto){
                    return item['ID'];
                }
            }
        }
    }
}


module.exports = {getProyectos, getNewsProyectos, getDirecciones, getServicios};