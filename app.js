const {leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
require('dotenv').config();




const main = async() =>{

    let opt;
    const busquedas = new Busquedas();

    

    do {
        
        opt = await inquirerMenu(); //Espera que seleccionemos una opción en el menu.

        switch (opt) {

            case 1:
                // mostrar mensaje
                const terminoDeBusqueda = await leerInput('Ciudad: ');

                // buscar los lugares
                const lugares = await busquedas.ciudad(terminoDeBusqueda);

                // seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado === '0') continue;
                const lugarSeleccionado = lugares.find(l => l.id === idSeleccionado); // busco el id que selecciono para poder pasarle los datos como la ciudad, lat, long 

                // guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // datos del clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.long);

                // mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:'.green, lugarSeleccionado.nombre);
                console.log('Lat:'.green, lugarSeleccionado.lat);
                console.log('Long:'.green, lugarSeleccionado.long);
                console.log('Temperatura:'.green, clima.temp );
                console.log('Mínima:'.green, clima.min );
                console.log('Máxima:'.green, clima.max);

                break;
        
            case 2:

            busquedas.historialCapitalizado.forEach((lugar, i) =>{

                const idx = `${i + 1}.`.green;
                console.log(`${idx} ${lugar}`);
            });
                break;
        }

        
        await pausa();

    } while (opt !== 0);
}

main();