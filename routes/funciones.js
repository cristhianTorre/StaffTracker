//const xlsx = require('xlsx');
const connect = require('./connect');
//const worbook = xlsx.readFile('staffingSystems.xlsx');
//const sheet_name_list = worbook.SheetNames;
//const parametro = sheet_name_list[0];
//const project = sheet_name_list[1];
//const staff = sheet_name_list[2];
//const staffing = sheet_name_list[3];
//const leerStaff = xlsx.utils.sheet_to_json(worbook.Sheets[staff]);
//const leerStaffing = xlsx.utils.sheet_to_json(worbook.Sheets[staffing]);
//const leerProyectos = xlsx.utils.sheet_to_json(worbook.Sheets[project]);
//const leerParametros = xlsx.utils.sheet_to_json(worbook.Sheets[parametro]);

/*
Conexion a base de datos y conversion de tablas a json
*/

function proyectosBD(){
    return new Promise((resolve, reject) => {
        connect.conexion.query('SELECT * FROM proyectos',
            (err, resultados) => {
                if (err) reject(err);
                else resolve(resultados);
            });
    });
}

function staffingBD(){
    return new Promise((resolve, reject) => {
        connect.conexion.query('SELECT * FROM staffing',
            (err, resultados) => {
                if (err) reject(err);
                else resolve(resultados);
            });
    });
}

function staffBD(){
    return new Promise((resolve, reject) => {
        connect.conexion.query('SELECT * FROM staff',
            (err, resultados) => {
                if (err) reject(err);
                else resolve(resultados);
            });
    });
}

function parametrosBD(){
    return new Promise((resolve, reject) => {
        connect.conexion.query('SELECT * FROM parametros',
            (err, resultados) => {
                if (err) reject(err);
                else resolve(resultados);
            });
    });
}

//Mostrar listado de personas acargo
async function nuevosIntegrantes(codigoJefe){
    let leerStaff = await staffBD();
    let nuevos = [];
    for(const itemFila of leerStaff){
        if(itemFila['superior'] == codigoJefe){
            nuevos.push({codigonew: itemFila['codigo'], nombrenew: itemFila['nombre'], dedicacionnew: estaOcupado(itemFila['codigo'])*100, tecnologianew: itemFila['tecnologia'], rolnew: itemFila['rol'], aso: Math.round(itemFila['ASO']), apx: Math.round(itemFila['APX']), cells: Math.round(itemFila['CELLS']), host: Math.round(itemFila['HOST']), bluespring: Math.round(itemFila['BLUESPRING']), python: Math.round(itemFila['PYTHON']), scala: Math.round(itemFila['SCALA'])});
        }
    }
    return nuevos;
}

//Backlog
async function getNewsProyectos(){
    let leerProyectos = await proyectosBD();
    let backlog = [];
    for(const itemFila of leerProyectos){
        if(itemFila['status'] == 'Stock'){
            backlog.push({ProjectIDName: itemFila['projectidname'], descripcion: itemFila['descripcion'], normativo: itemFila['normativo'], scrum: itemFila['scrum'], fecIni: itemFila['fecha_inicial'], fecFin: itemFila['fecha_final'], nuevos: nuevosIntegrantes('C797459')});
        }
    }
    return backlog;
}

//Staffing - proyectos con sus respectivos empleados y cronograma
async function getProyectos(direccion, servicio){
    let leerStaffing = await staffingBD();
    let proyectos = [];
    let informacion = [];
    for(const itemFila of leerStaffing){
        if(itemFila['servicio'] == servicio && itemFila['direccion'] == direccion && getStatusFlow(itemFila['proyecto'])){
            if(inArreglo(staffingProject(itemFila['proyecto']), proyectos)){
                informacion.push(Object.assign(consultaInformacionProyecto(itemFila['proyecto']), {emplo: getEmpleados(itemFila['proyecto'])}));
                proyectos.push(staffingProject(itemFila['proyecto']));
            }
        }
    }
    return informacion;
}

async function estaOcupado(codigo){
    let leerStaffing = await staffingBD();
    var suma = 0;
    for(const itemFila of leerStaffing){
        if(itemFila['codigo'] == codigo){
            suma += itemFila['dedicacion'];
        }
    }
    return suma;
}

async function getStatusFlow(proyecto){
    let leerProyectos = await proyectosBD();
    for(const itemFila of leerProyectos){
        if(itemFila['projectidname'] == proyecto && itemFila['status'] == 'Flow'){
            return true;
        }
    }
    return false;
}

async function staffingProject(proyecto){
    let leerStaffing = await staffingBD();
    let leerProyectos = await proyectosBD();
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

async function getEmpleados(proyecto){
    let leerStaffing = await staffingBD();
    let empleados = [];
    for(const itemFila of leerStaffing){
        if(itemFila['proyecto'] == proyecto){
            empleados.push({codigo: itemFila['codigo'], nombre: itemFila['nombre'], dedicacion: itemFila['dedicacion']*100, tecnologia: itemFila['tecnologia'], rol: itemFila['rol']});
        }
    }
    return empleados;
}

async function consultaInformacionProyecto(proyecto){
    let leerProyectos = await proyectosBD();
    let informacion = {};
    for(const itemFila of leerProyectos){
        if(itemFila['projectidname'] == proyecto){
            Object.assign(informacion,{ProjectIDName: itemFila['projectidname'], descripcion: itemFila['descripcion'], normativo: itemFila['normativo'], scrum: itemFila['scrum'], owner: itemFila['owner'], status: itemFila['status'], fecIni: itemFila['fecha_inicial'], fecFin: itemFila['fecha_final']});
        }
    }
    return informacion;
}

async function getDirecciones(){
    let leerParametros = await parametrosBD();
    let direcciones = [];
    let ids = [];
    for(const itemFila of leerParametros){
        if(inArreglo(itemFila['id'], ids)){
            direcciones.push({nombre: itemFila['direccion']});
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
        if(item['projectidname'] !== undefined){
            i += 1;
        }
    }
    return i;
}

async function getServicios(direccion){
    let leerParametros = await parametrosBD();
    let servicios = [];
    for(const itemFila of leerParametros){
        if(itemFila['direccion'] == direccion){
            servicios.push({nombre: itemFila['servicio']});
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
async function getBoss(codigo) {
    let leerStaff = await staffBD();
    for(const itemFila of leerStaff){
        if(itemFila['codigo'] == codigo){
            return itemFila['superior'];
        }
    }
    return 'No tiene jefe';
}


async function staffingProject(proyecto){
    let leerStaffing = await staffingBD();
    let leerProyectos = await proyectosBD();
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