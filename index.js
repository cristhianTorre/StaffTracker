const express = require('express');
const app = express();
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



app.get('/', function(req, res){

    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><style>*{margin: 0;padding: 0;}header{background-color: #303030d5;width: auto;height: auto;}.navbar a{color: bisque;}.dropdown-menu a{color: black;}.titleContent{text-align: center;margin: 20px 0 20px 0;color: rgb(141, 138, 138);animation: neon 2s infinite;}.generalContainer{margin: 30px 30px 0 30px;}.containerProjectCourse{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0px 30px 0 30px;background-color: rgba(147, 248, 147, 0.788);}.containerProject{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;margin: 2px;background-color: white;}.cardProyecto{border-right: 1px dashed rgb(203, 231, 255);height: auto}.titles{font-size:medium;color: rgb(13, 40, 163);height: auto;margin: 8px 0 8px 0;}.subTitles{font-weight: bolder;}#listProject{font-size:small;list-style: none;padding: 0;margin-left: 10px;}.persons{height: 140px;background-color: white;}.listPerson, .listTrimestre{display: inline-flex;}.itemListPerson{width: 120px;padding: 0px;list-style: none;text-align: center;}.itemListTrimestre{width: 25%;padding: 0px;list-style: none;text-align: center;}.person{font-size:x-small;}.personCode{margin: 0;}.imagePerson{width: auto;height: 50px;border-radius: 25px;}.containerSchedule{border-top: 1px dashed rgb(203, 231, 255);border-radius: 4px;height: 120px;background-color: white;}.containerProjectBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;background-color: rgb(250, 93, 93);}.containerBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: 120px;margin: 2px;background-color: white;}</style><title>Front01</title></head>';
    html += '<body><header><nav class="navbar navbar-expand-lg bg-body-tertiary" ><div class="container-fluid"><a class="navbar-brand fw-bold" href="#">Inicio</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarSupportedContent"><ul class="navbar-nav me-auto mb-2 mb-lg-0"><li class="nav-item"><a class="nav-link fw-semibold" href="https://www.youtube.com/@AprendemosJuntos" target="_blank">Youtube</a></li><li class="nav-item"><a class="nav-link fw-semibold" href="https://www.linkedin.com/company/bbva/" target="_blank">Linkedin</a></li><li class="nav-item dropdown"><a class="nav-link dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Proyectos Recientes</a><ul class="dropdown-menu"><li><a class="dropdown-item fw-semibold" href="" target="_blank">Proyecto SDATOOL 001</a></li><li><a class="dropdown-item fw-semibold" href="" target="_blank">Proyecto SDATOOL 002</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item fw-semibold" href="#">Proyecto SDATOOL 003</a></li><li><a class="dropdown-item fw-semibold" href="#">Proyecto SDATOOL 004</a></li></ul></li></ul><form class="d-flex" role="search" style="align-items: center;"><input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" style="height: 25px;"><button class="btn btn-outline-success" type="submit" style="width: auto; padding: 0 5px; height: 25px;">Search</button></form></div></div></nav></header><div class="generalContainer"><div class="containerProjectCourse"><div style="margin: 6px 0 0 15px;"><h4>Proyectos en curso</h4> </div>' + pintarProyecto() + '<div class="containerProjectBacklog"><div style="margin: 6px 0 0 15px;"><h4>Backlog</h4></div>'+ pintarBackLog() +'</div></div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script></body></html>'; 
    res.send(html);

    /*
    FRONT-END
    */

    function pintarProyecto(){
        //console.log('Funciona');
        var texthtml = '';               
        const valores = getProyectos('CORE','Cross/Gestor documental y SSDD');
        for(var i=0; i<valores.length; i++){
            //var proyecto = valores[i][1];
            var empleados = valores[i][0];
            texthtml += '<div class="containerProject row"><div class="cardProyecto col-sm-4"><h2 id="titleProject" class="titles">'+valores[i][1][0]+'</h2><ol id="listProject" class="list"><li><p class="subTitles">Descripción: </p>'+valores[i][1][1]+'</li><li>Tipo: '+valores[i][1][2]+'</li><li>Scrum: '+valores[i][1][3]+'</li><li>Product Owner: '+valores[i][1][4]+'</li><li>Estado: '+valores[i][1][5]+'</li></ol></div><div class="othersProyecto col-sm-8"><div class="persons row"><h2 class="titles">Personas asociadas: </h2><ol class="listPerson">';
            for(var j=0; j<empleados.length; j++){
                //var empleado = valores[i][0][j];
                texthtml += '<li class="itemListPerson"><div class="person"><h5  class="person personCode">'+valores[i][0][j][0]+'</h5><h6  class="person" style="height:24px">'+valores[i][0][j][1]+'</h6><img class="imagePerson" src="https://img.freepik.com/vector-premium/icono-usuario-hombre-traje-negocios_454641-453.jpg?w=50" class="img-fluid rounded-start" alt="..."><p class=""><small class="text-muted">'+(valores[i][0][j][2])*100+'% / '+valores[i][0][j][3]+' / '+valores[i][0][j][4]+'</small></p></div></li>';
            }
            texthtml += '</ol></div><div class="containerSchedule row"><h2 class="titles">Cronograma: </h2><ol class="listTrimestre"><li class="itemListTrimestre"><div class="person"><h5  class="person personCode">Periodo en curso</h5><div class="indicadorCronograma" style="display: inline-flex; width: 400px; margin: 8px auto;"><p class="col-3">'+valores[i][1][6]+'</p><progress id="file" max="100" value="70"> 70% </progress><p class="col-3">'+valores[i][1][7]+'</p></div></div></li></ol></div></div></div>';
        }
        return texthtml;
        //console.log('Funciona2');
        //document.getElementById('contenedorValores').innerHTML = texthtml;
    }

    function pintarBackLog(){
        var texthtml = '';
        const valores = getNewsProyectos();
        for(var i=0; i<valores.length; i++){
            texthtml += '<div class="containerProject row"><div class="cardProyectoBacklog col-sm-8"><h2 id="titleProject" class="titles">Proyecto: '+valores[i][0]+'</h2><ol id="listProject" class="list"><li>Descripción: '+valores[i][1]+'</li><li>Tipo: '+valores[i][2]+'</li><li>Scrum: '+valores[i][3]+'</li></ol></div><div class="othersProyectoBacklog col-sm-4"><div class="containerScheduleBacklog row"><h2 class="titles">Cronograma: </h2><ol class="listTrimestre"><li class="itemListTrimestre"><div class="person"><h5  class="person personCode">Rango de ejecución</h5><div class="indicadorCronograma" style="display: inline-flex; width: 400px; margin: 8px auto;"><p class="col-3">'+valores[i][4]+'</p><progress id="file" max="100" value="0"> 0% </progress><p class="col-3">'+valores[i][5]+'</p></div></div</li></ol></div></div></div>';
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
            if(itemFila['Status'] == 'Stock'){
                newProyectos.push([itemFila['Project ID Name'], itemFila['Description (What & Where)'], itemFila['Normativo'], itemFila['scrum'], itemFila['Start Date'], itemFila['End date']]);
            }
        }
        return newProyectos;
    }
    
    //Staffing - proyectos con sus respectivos empleados y cronograma
    function getProyectos(direccion, servicio){
        let proyectos = [];
        let informacion = [];
        let suma = 0;
        for(const itemFila of leerStaffing){
            if(itemFila['Servicio'] == servicio && itemFila['Dirección'] == direccion && getStatusFlow(itemFila['Proyecto'])){
                if(inArreglo(staffingProject(itemFila['Proyecto']), proyectos)){
                    informacion.push([getEmpleados(itemFila['Proyecto']), consultaInformacionProyecto(itemFila['Proyecto'])]);
                    //console.log(itemFila['Proyecto']);
                    proyectos.push(staffingProject(itemFila['Proyecto']));
                }else{
                    suma += 1;
                }
            }
        }
        //console.log(suma);
        //console.log(informacion);
        return informacion;
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

app.get('/proyectos-elkin', function(req, res){
    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"><style>*{margin: 0;padding: 0;}.generalContainer{margin: 30px 30px 0 30px;}.containerProjectCourse{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0px 30px 0 30px;background-color: rgba(147, 248, 147, 0.788);}.containerProject{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;margin: 2px;background-color: white;}.cardProyecto{border-right: 1px dashed rgb(203, 231, 255);height: 250px;}.titles{font-size:small;height: 14px;margin: 8px 0 8px 0;}#listProject{font-weight: bolder;font-size:x-small;list-style: none;padding: 0;margin-left: 10px;}.persons{height: 140px;background-color: white;}.listPerson, .listTrimestre{display: inline-flex;}.itemListPerson{width: 120px;padding: 0px;list-style: none;text-align: center;}.itemListTrimestre{width: 25%;padding: 0px;list-style: none;text-align: center;}.person{font-size:x-small;}.personCode{margin: 0;}.imagePerson{width: auto;height: 50px;border-radius: 25px;}.containerSchedule{border-top: 1px dashed rgb(203, 231, 255);border-radius: 4px;height: 120px;background-color: white;}.containerProjectBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: auto;min-width: 600px;margin: 0 30px 30px 30px;background-color: rgb(250, 93, 93);}.containerBacklog{border: 1px solid rgb(64, 153, 226);border-radius: 4px;height: 120px;margin: 2px;background-color: white;}</style><title>Front01</title></head>';
    html += '<body><div class="generalContainer"><div class="containerProjectCourse">' + pintarProyectoJefe() + '<div class="containerProjectBacklog"><div class="containerBacklog"><h2 id="titleProject" class="titles">Backlog: </h2></div></div></div></div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script></body></html>'; 
    res.send(html);

     /*
    FRONT-END
    */

    function pintarProyectoJefe(){
        let jefe = 'C797459';
        var texthtml = '';               
        const valores = getProyectosJefe(jefe);
        for(var i=0; i<valores.length; i++){
            var empleados = valores[i][0];
            texthtml += '<div class="containerProject row"><div class="cardProyecto col-sm-4"><h2 id="titleProject" class="titles">Proyecto: '+valores[i][1][0]+'</h2><ol id="listProject" class="list"><li>Descripción: '+valores[i][1][1]+'</li><li>Tipo: '+valores[i][1][2]+'</li><li>Scrum: '+valores[i][1][3]+'</li><li>Product Owner: '+valores[i][1][4]+'</li><li>Estado: '+valores[i][1][5]+'</li></ol></div><div class="othersProyecto col-sm-8"><div class="persons row"><h2 class="titles">Personas: </h2><ol class="listPerson">';
            for(var j=0; j<empleados.length; j++){
                texthtml += '<li class="itemListPerson"><div class="person"><h5  class="person personCode">'+valores[i][0][j][0]+'</h5><h6  class="person">'+valores[i][0][j][1]+'</h6><img class="imagePerson" src="https://img.freepik.com/vector-premium/icono-usuario-hombre-traje-negocios_454641-453.jpg?w=50" class="img-fluid rounded-start" alt="..."><p class=""><small class="text-muted">'+valores[i][0][j][2]+' / '+valores[i][0][j][3]+' / '+valores[i][0][j][4]+'</small></p></div></li>';
            }
            texthtml += '</ol></div><div class="containerSchedule row"><h2 class="titles">cronograma: </h2><ol class="listTrimestre"><li class="itemListTrimestre"><div class="person"><h5  class="person personCode">Primer Trimestre</h5><ol><li>'+valores[i][1][6]+'</li><li>'+valores[i][1][7]+'</li></ol></div></li></ol></div></div></div>';
        }
        return texthtml;
    }

    /*
    BACK-END
    */

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

app.listen(3000);