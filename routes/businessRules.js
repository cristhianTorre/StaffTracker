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
    for (const itemStaffing of staffing) {
        for (const itemFeature of features) {
            if (itemFeature['codigo'] == itemStaffing['feature']) {
                if (itemFeature['fecha_inicio'] <= hoy <= itemFeature['fecha_fin']) {
                    for (const itemPersona of personas) {
                        if (itemPersona['codigo'] == itemStaffing['persona']) {
                            let ocupacion = (itemPersona['ocupacion_total'] + itemStaffing['ocupacion']).toString();
                            connect.conexion.query(actualizacion, [ocupacion, itemPersona['codigo']], function (err, rows, fields) {
                                if (!!err) {
                                    console.log('Error', +err);
                                }
                                else {
                                    console.log("Empleado actualizado");
                                }
                            });
                        }
                    }
                }
            }
        }
    }
}

function actualizar_internos_externos_features(){
    
}

//Actualizaciones Features

module.exports = {set_internos_externos_cero, set_ocupacion_cero, actualizar_ocupacion_actual};