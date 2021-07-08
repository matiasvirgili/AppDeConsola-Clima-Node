const fs = require('fs');
const axios = require('axios');

class Busquedas {

        historial = [];
        dbPath = './db/database.json';

        constructor(){
            //TODO: leer DB si existe
            this.leerDB();

        }

        get historialCapitalizado(){

            return this.historial.map(lugar => {

                let palabras = lugar.split(' ');
                palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
                return palabras.join(' ');
            });
        }

        get paramsMapbox(){
            return {
                 'access_token': process.env.MAPBOX_KEY,
                 'limit':5,
                 'language':'es'
            }
        }

        async ciudad(lugar = ''){
            try{
                
            //peticion http

                const intance = axios.create({

                    baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                    params: this.paramsMapbox

                });

                const resp = await intance.get();
                
                return resp.data.features.map(lugar => ({

                    id: lugar.id,
                    nombre: lugar.place_name,   // estoy retornando un objeto de forma implisita, con los atributos que yo quiero
                    long: lugar.center[0],
                    lat: lugar.center[1]
                })); 
            
                // retornar todos los lugares que coincidan con lo que ingreso el usuario

            } catch(error){

                return [];
            }
        }

        get paramsWeather(){

            return {
              
                appid : process.env.OPENWEATHER_KEY,
                units: 'metric',
                lang: 'es'
            }
        }

        async climaLugar(lat, lon){

            try {
                //intance axios.create()
                const intance = axios.create({

                    baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                    params: {...this.paramsWeather, lat, lon} //desestructuro y los mando aca y no en el get, donde mando el id el units y el lang
                });
                
                //resp.data
                const resp = await intance.get();
                const {weather, main} = resp.data;
                
                return {
                    
                    desc: weather[0].description,
                    min: main.temp_min,
                    max: main.temp_max,
                    temp: main.temp
                }

            } catch (error) {
                console.log(Error);
            }
        }


        agregarHistorial(lugar = ''){

            if(this.historial.includes(lugar.toLocaleLowerCase())){
                return;
            }
            
            this.historial = this.historial.slice(0,5);
            this.historial.unshift(lugar.toLocaleLowerCase());

            // grabar en DB
            this.guardarDB();
        }

        guardarDB(){

            const payload = {

                historial: this.historial
            }

            fs.writeFileSync(this.dbPath, JSON.stringify(payload));
        }

        leerDB(){

            if (!fs.existsSync(this.dbPath)) return; 
            const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
            const data = JSON.parse(info);   
             
            this.historial = data.historial;
        }
    }
    
    
    
    
    module.exports = Busquedas;
    
    // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/madrid.json?access_token=pk.eyJ1IjoibWF0aWFzdmlyZ2lsaSIsImEiOiJja3BlbDBhMGMwYXBkMnVsZTdsa3pocWxsIn0.5ZRDe6hzSXx2rHBQA-Mnhg&limit=5&language=es');