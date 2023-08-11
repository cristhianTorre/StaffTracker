const connect = require('./connect');

//Actualizaciones diarias


//Validaciones Reglas de oro

function set_ocupacion_cero(){
    let actualizacion_cero = 'UPDATE personas SET ocupacion_total = 0';
    connect.conexion.query(actualizacion_cero, function (err, rows, fields) {
        if (!!err) {
            console.log('Error', +err);
        }
        else {
            console.log("Reset realizado");
        }
    });
}

function set_internos_externos_cero(){
    let actualizacion_cero = 'UPDATE features SET internos = 0, externos = 0';
    connect.conexion.query(actualizacion_cero, function (err, rows, fields) {
        if (!!err) {
            console.log('Error', +err);
        }
        else {
            console.log("Reset realizado");
        }
    });
}

function actualizar_ocupacion_actual(staffing, features, personas) {
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    let actualizacion = 'UPDATE personas SET ocupacion_total = ? WHERE codigo = ?';
    for(const persona of personas){
        let ocupacion_t = 0;
        for(const staff of staffing){
            if(persona['codigo'] == staff['persona']){
                for(const feature of features){
                    if(feature['codigo'] == staff['feature'] && Date.parse(feature['fecha_inicio']) <= hoy && hoy <= Date.parse(feature['fecha_fin'])){
                        ocupacion_t += parseInt(staff['ocupacion']);
                    }
                }
            }
        }
        connect.conexion.query(actualizacion, [ocupacion_t, persona['codigo']], function (err, rows, fields) {
            if (!!err) {
                console.log('Error', +err);
            }
        });
    }
}

function actualizar_internos_externos_features(staffing, features, personas){
    let actualizacion = 'UPDATE features SET internos = ?, externos = ? WHERE codigo = ?';
    for(const feature of features){
        let internos = 0;
        let externos = 0;
        for(const staff of staffing){
            if(staff['feature']==feature['codigo']){
                for(const persona of personas){
                    if(persona['codigo']==staff['persona'] && persona['empresa']=='BBVA'){
                        internos += 1;
                    }else if(persona['codigo']==staff['persona'] && persona['empresa']!='BBVA'){
                        externos += 1;
                    }
                }
            }
        }
        connect.conexion.query(actualizacion, [internos, externos, feature['codigo']], function (err, rows, fields) {
            if (!!err) {
                console.log('Error', +err);
            }
        });
    }
}

//Actualizaciones Features

function insercion_reglas_asociadas(features, reglas_asociadas, reglas){
    for(const feature of features){
        let value = 0;
        for(const regla_asociada of reglas_asociadas){
            if(regla_asociada['feature'] == feature['codigo']){
                value = 1;
            }
        }
        if(value == 0){
            let insertar = [];
            for(const regla of reglas){
                let expr = 'INSERT INTO reglas_asociadas(feature, regla, cumple) VALUES ("'+feature['codigo']+'","'+regla['id']+'","1")';
                insertar.push(expr);
            }
            connect.conexion.query(insertar.join(';'), function (err, rows, fields) {
                if (!!err) {
                    console.log('Error', +err);
                }
            });
        }
    }
}

//Revision de reglas de oro por feature

function regla_numero_uno(feature){
    let actualizar = 'UPDATE reglas_asociadas SET cumple = ? WHERE feature = ?';
    let booleano = 1;
    if(feature['internos'] < feature['externos']){
        booleano = 0;
    }
    connect.conexion.query(actualizar, [booleano, feature['codigo']], function (err, rows, fields) {
        if (!!err) {
            console.log('Error', +err);
        }
    });
}

function codigosStaffinActual(staffing, features){
    const arreglo = [];
    for(const staff of staffing){
        if(enFechaActual(features, staff['feature'])){
            if(verificarDiccionario(arreglo, staff['persona'])){
                for(let i = 0; i<arreglo.length; i++){
                    if(arreglo[i].persona == staff['persona']){
                        arreglo[i].features.push(staff['feature']);
                    }
                }
            }else{
                arreglo.push({persona: staff['persona'], features: [staff['feature']]});
            }
        }
    }
    for(let i = 0; i<arreglo.length; i++){
        if(arreglo[i].features.length > 2){
            for(let j = 0; j<arreglo[i].features.length; j++){
                let upd = 'UPDATE reglas_asociadas SET cumple = 0 WHERE feature = "'+arreglo[i].features[j]+'" AND regla = 2';
                connect.conexion.query(upd, function (err, rows, fields) {
                    if (!!err) {
                        console.log('Error', +err);
                    }
                });
            }
        }
        else{
            for(let j = 0; j<arreglo[i].features.length; j++){
                let updV = 'UPDATE reglas_asociadas SET cumple = 1 WHERE feature = "'+arreglo[i].features[j]+'" AND regla = 2';
                connect.conexion.query(updV, function (err, rows, fields) {
                    if (!!err) {
                        console.log('Error', +err);
                    }
                });
            }
        }
    }
}

function verificarDiccionario(dic, persona){
    for(let i = 0; i<dic.length; i++){
        if(dic[i].persona == persona){
            return true;
        }
    }
    return false;
}

function enFechaActual(features, codigo){
    for(const feature of features){
        if(feature['codigo'] == codigo){
            if(new Date(feature['fecha_inicio']).getTime() <= Date.now() && new Date(feature['fecha_fin']).getTime() >= Date.now()){
                return true;
            }else{
                return false;
            }
        }
    }
}

module.exports = {set_internos_externos_cero, set_ocupacion_cero, actualizar_ocupacion_actual, actualizar_internos_externos_features, insercion_reglas_asociadas,
    regla_numero_uno, codigosStaffinActual};