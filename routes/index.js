var express = require('express');
var router = express.Router();
var hbs = require('hbs')
const xlsx = require('xlsx');
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

router.get('/', function(req, res){

    var html = {proyectos: getProyectos('CORE','Cross/Gestor documental y SSDD'), backlog: getNewsProyectos(), newmembers: nuevosIntegrantes('C797459')};
    res.render('index', html);

    //Mostrar listado de personas acargo
    function nuevosIntegrantes(codigoJefe){
        let nuevos = [];
        for(const itemFila of leerStaff){
            if(itemFila['SUPERIOR'] == codigoJefe){
                nuevos.push({codigonew: itemFila['Código'], nombrenew: itemFila['Nombre'], dedicacionnew: estaOcupado(itemFila['Código'])*100, tecnologianew: itemFila['TECNOLOGÌA'], rolnew: itemFila['ROL'], aso: itemFila['ASO'], apx: itemFila['APX'], cells: itemFila['CELLS'], host: itemFila['HOST'], bluespring: itemFila['BLUESPRING'], python: itemFila['PYTHON'], scala: itemFila['SCALA']});
            }
        }
        console.log(nuevos);
        return nuevos;
    }

    //Backlog
    function getNewsProyectos(){
        let newProyectos = [];
        for(const itemFila of leerProyectos){
            if(itemFila['Status'] == 'Stock'){
                newProyectos.push({ProjectIDName: itemFila['Project ID Name'], descripcion: itemFila['Description (What & Where)'], normativo: itemFila['Normativo'], scrum: itemFila['scrum'], fecIni: itemFila['Start Date'], fecFin: itemFila['End date']});
            }
        }
        return newProyectos;
    }
    
    //Staffing - proyectos con sus respectivos empleados y cronograma
    function getProyectos(direccion, servicio){
        let proyectos = [];
        let informacion = [];
        for(const itemFila of leerStaffing){
            if(itemFila['Servicio'] == servicio && itemFila['Dirección'] == direccion && getStatusFlow(itemFila['Proyecto'])){
                if(inArreglo(staffingProject(itemFila['Proyecto']), proyectos)){
                    informacion.push(Object.assign(consultaInformacionProyecto(itemFila['Proyecto']), {emplo: getEmpleados(itemFila['Proyecto'])}));
                    //console.log(itemFila['Proyecto']);
                    proyectos.push(staffingProject(itemFila['Proyecto']));
                }
            }
        }
        console.log(informacion);
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
    
});

router.post('/', function(req, res){

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
});

router.get('/proyectos-elkin', function(req, res){
    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><style>*{margin: 0;padding: 0;}.generalContainer{margin: 30px 30px 0 30px;}.containerProjectCourse{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0px 30px 0 30px;background-color: rgba(147, 248, 147, 0.788);}.containerProject{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;margin: 2px;background-color: white;}.cardProyecto{border-right: 1px dashed rgb(203, 231, 255);height: 250px;}.titles{font-size:small;height: 14px;margin: 8px 0 8px 0;}#listProject{font-weight: bolder;font-size:x-small;list-style: none;padding: 0;margin-left: 10px;}.persons{height: 140px;background-color: white;}.listPerson, .listTrimestre{display: inline-flex;}.itemListPerson{width: 120px;padding: 0px;list-style: none;text-align: center;}.itemListTrimestre{width: 25%;padding: 0px;list-style: none;text-align: center;}.person{font-size:x-small;}.personCode{margin: 0;}.imagePerson{width: auto;height: 50px;border-radius: 25px;}.containerSchedule{border-top: 1px dashed rgb(203, 231, 255);border-radius: 4px;height: 120px;background-color: white;}.containerProjectBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0 30px 30px 30px;background-color: rgb(250, 93, 93);}.containerBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: 120px;margin: 2px;background-color: white;}</style><title>Front01</title></head>';
    html += '<body><div class="generalContainer"><div class="containerProjectCourse">' + pintarProyectoJefe() + '<div class="containerProjectBacklog"><div class="containerBacklog"><h2 id="titleProject" class="titles">Backlog: </h2></div></div></div></div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script></body></html>'; 
    //res.send(html);

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

    function getLength(documento){
        var i = 0;
        for(const item of documento){
            if(item['Nombre'] !== undefined){
                i += 1;
            }
        }
        console.log(i);
        return i;
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
                empleados.push([itemFila['Código'], itemFila['Nombre'], itemFila['Dedicación'], itemFila['TECNOLOGÌA'], itemFila['ROL']]);
            }
        }
        return empleados;
    }
    
    function consultaInformacionProyecto(proyecto){
        let informacion = [];
        for(const itemFila of leerProyectos){
            if(itemFila['Project ID Name'] == proyecto){
                informacion.push(itemFila['Project ID Name']);
                informacion.push(itemFila['Description (What & Where)']);
                informacion.push(itemFila['NORMATIVO']);
                informacion.push(itemFila['scrum']);
                informacion.push(itemFila['Project / Product Owner']);
                informacion.push(itemFila['Status']);
                informacion.push(itemFila['Start Date']);
                informacion.push(itemFila['End date']);
            }
        }
        return informacion;
    }

});

module.exports = router;