

const express = require('express');
const app = express();
const xlsx = require('xlsx');



app.get('/', function(req, res){
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

    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><style>*{margin: 0;padding: 0;}.generalContainer{margin: 30px 30px 0 30px;}.containerProjectCourse{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0px 30px 0 30px;background-color: rgba(147, 248, 147, 0.788);}.containerProject{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;margin: 2px;background-color: white;}.cardProyecto{border-right: 1px dashed rgb(203, 231, 255);height: 250px;}.titles{font-size:small;height: 14px;margin: 8px 0 8px 0;}#listProject{font-weight: bolder;font-size:x-small;list-style: none;padding: 0;margin-left: 10px;}.persons{height: 140px;background-color: white;}.listPerson, .listTrimestre{display: inline-flex;}.itemListPerson{width: 120px;padding: 0px;list-style: none;text-align: center;}.itemListTrimestre{width: 25%;padding: 0px;list-style: none;text-align: center;}.person{font-size:x-small;}.personCode{margin: 0;}.imagePerson{width: auto;height: 50px;border-radius: 25px;}.containerSchedule{border-top: 1px dashed rgb(203, 231, 255);border-radius: 4px;height: 120px;background-color: white;}.containerProjectBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0 30px 30px 30px;background-color: rgb(250, 93, 93);}.containerBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: 120px;margin: 2px;background-color: white;}</style><title>Front01</title></head>';
    html += '<body><div class="generalContainer"><div class="containerProjectCourse">' + pintarProyecto() + '<div class="containerProjectBacklog"><div class="containerBacklog"><h2 id="titleProject" class="titles">Backlog: </h2></div></div></div></div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script></body></html>'; 
    res.send(html);

    /*
    FRONT-END
    */

    function pintarProyecto(){
        //console.log('Funciona');
        var texthtml = '<div class="containerProject row">';               
        const valores = getProyectos('CORE','Cross/Gestor documental y SSDD');
        for(var i=0; i<valores.length; i++){
            //var proyecto = valores[i][1];
            var empleados = valores[i][0];
            texthtml += '<div class="cardProyecto col-sm-4"><h2 id="titleProject" class="titles">Proyecto: '+valores[i][1][0]+'</h2><ol id="listProject" class="list"><li>Descripción: '+valores[i][1][1]+'</li><li>Tipo: '+valores[i][1][2]+'</li><li>Scrum: '+valores[i][1][3]+'</li><li>Product Owner: '+valores[i][1][4]+'</li><li>Estado: '+valores[i][1][5]+'</li></ol></div>';
            for(var j=0; j<empleados.length; j++){
                //var empleado = valores[i][0][j];
                texthtml += '<div class="othersProyecto col-sm-8"><div class="persons row"><h2 class="titles">Personas: </h2><ol class="listPerson"><li class="itemListPerson"><div class="person"><h5  class="person personCode">'+valores[i][0][j][0]+'</h5><h6  class="person">'+valores[i][0][j][1]+'</h6><img class="imagePerson" src="https://img.freepik.com/vector-premium/icono-usuario-hombre-traje-negocios_454641-453.jpg?w=50" class="img-fluid rounded-start" alt="..."><p class=""><small class="text-muted">'+valores[i][0][j][2]+' / '+valores[i][0][j][3]+' / '+valores[i][0][j][4]+'</small></p></div></li></ol></div>';
            }
            texthtml += '<div class="containerSchedule row"><h2 class="titles">cronograma: </h2><ol class="listTrimestre"><li class="itemListTrimestre"><div class="person"><h5  class="person personCode">Primer Trimestre</h5><ol><li>'+valores[i][1][6]+'</li><li>'+valores[i][1][7]+'</li></ol></div></li></ol></div></div>';
        }
        texthtml += '</div>';
        return texthtml;
        //console.log('Funciona2');
        //document.getElementById('contenedorValores').innerHTML = texthtml;
    }

    function pintarBackLog(){
        var texthtml = '';
        const valores = getNewsProyectos();
        for(var i=0; i<valores.length; i++){

        }
        return texthtml;
    }

    /*
    BACK-END
    */

    //Muestra todos los empleados de un proyecto
    function consultaEmpleados(codigo){
        let informacion = [];
        for(const itemFila of leerStaff){
            if(itemFila['Código'] == codigo){
                informacion.push(itemFila['Código']);
                informacion.push(itemFila['Nombre']);
                informacion.push(itemFila['ROL']);
                informacion.push(itemFila['Empresa']);
                informacion.push(itemFila['Ubicación']);
                informacion.push(Math.round(itemFila['ASO']));
                informacion.push(Math.round(itemFila['APX']));
                informacion.push(Math.round(itemFila['CELLS']));
                informacion.push(Math.round(itemFila['HOST']));
                informacion.push(Math.round(itemFila['BLUESPRING']));
                informacion.push(Math.round(itemFila['PYTHON']));
                informacion.push(Math.round(itemFila['SCALA']));
                console.log(itemFila['Nombre']);
            }
        }
    
        informacion.push(consultaProyectos(informacion[0]));
        console.log(informacion);
        return informacion;
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
    
    //Backlog
    function getNewsProyectos(){
        let newProyectos = [];
        for(const itemFila of leerProyectos){
            if(itemFila['Start Date'] == undefined){
                newProyectos.push([itemFila['Project ID Name'], itemFila['Project ID'], itemFila['Name']]);
            }
        }
        return newProyectos;
    }
    
    //Staffing - proyectos con sus respectivos empleados y cronograma
    function getProyectos(direccion, servicio){
        let proyectos = [];
        let informacion = [];
        for(const itemFila of leerStaffing){
            if(itemFila['Servicio'] == servicio && itemFila['Dirección'] == direccion && !(itemFila['Proyecto'] in proyectos)){
                informacion.push([getEmpleados(itemFila['Proyecto']), consultaInformacionProyecto(itemFila['Proyecto'])]);
                proyectos.push(itemFila['Proyecto']);
            }
        }
        //console.log(informacion);
        return informacion;
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
            if(itemFila['Project ID $ Name'] == proyecto){
                informacion.push(itemFila['Project ID $ Name']);
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
    
    //Consulta todos los proyectos asociados a una persona
    function consultaProyectos(codigo){
        let proyectos = [];
        for(const itemFila of leerStaffing){
            if(itemFila['Código'] == codigo){
                proyectos.push([itemFila['Proyecto'], itemFila['Dedicación'], itemFila['ROL']]);
                //console.log(itemFila['Proyecto']);
            }
        }
        //console.log(proyectos);
        return proyectos;
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
    
    //Obtener el nombre del empleado
    function getName(codigo){
        for(const itemFila of leerStaff){
            if(itemFila['Código'] == codigo){
                return itemFila['Nombre'];
            }
        }
        return 'No tiene nombre';
    }
    
    //Obtiene toda la informacion para asignarla en Staffing al agregar el empleado en un nuevo proyecto
    function getInformacion(codigo){
        let informacion = [];
        for(const itemFila of leerStaff){
            if(itemFila['Código'] == codigo){
                informacion.push(itemFila['Código']);
                informacion.push(itemFila['Nombre']);
                informacion.push(itemFila['Dirección']);
                informacion.push(itemFila['Servicio']);
                informacion.push(itemFila['Empresa']);
            }
        }
        console.log(informacion[0]);
        return informacion;
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
});
app.listen(3000);