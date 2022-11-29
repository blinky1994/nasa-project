const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const { find } = require('./planets.mongo');

const planets = require('./planets.mongo')

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv' ) )
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)){
                await savePlanet(data);
              }
        })
        .on('error', (err) => {
            console.error(err);
            reject(err);
        })
        .on('end', async () => {
            resolve();
        });
    });
}

async function getAllPlanets() {
    return await planets.find({});
}

async function savePlanet(planet) {
    try {
        await planets.updateOne(
            {
                keplerName: planet.kepler_name 
            }, 
            {
                keplerName: planet.kepler_name 
            }, 
            {
                upsert: true
            });
    } catch (err) {
        console.error('Error saving planet', err)
    }
   
}

module.exports = {
    getAllPlanets,
    loadPlanetsData
}