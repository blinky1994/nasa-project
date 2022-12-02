const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({ flightNumber: launchId })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
    .findOne({})
    .sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await launchesDatabase
    .find({}, {
        '__v': 0, // Exclude version key
        '_id': 0 // Exclude Object ID
    })
    .sort({ flightNumber: -1 })
    .skip(skip)
    .limit(limit);
}

async function abortLaunchById(launchId) {
    const aborted = await  launchesDatabase.updateOne(
        { 
            flightNumber: launchId
        },
        {
            upcoming: false,
            success: false
        } 
    )
    return aborted.modifiedCount === 1;
}

async function saveLaunch(launch) {
    try {
        await launchesDatabase.findOneAndUpdate(
            {
                flightNumber: launch.flightNumber
            }, 
            launch,
            {
                upsert: true
            });
    } catch (err) {
        console.error('Error saving launch', err)
    }
}

async function populateLaunches() {
    console.log(`Downloading launch data from ${process.env.SPACEX_API_URL}`);

    const response = await axios.post(process.env.SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.error('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    
    launchDocs.forEach(async (launchDoc) => {
        const payloads = launchDoc['payloads'];

        const customers = payloads.flatMap(payload => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            customers: customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            target: 'None'
        }

        await saveLaunch(launch);
    });

    // Populate launches collection
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })

    if (firstLaunch) {
        console.log('Launch data has been loaded. Moving on...');
    } else {
        await populateLaunches();
    }
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.find({ keplerName: launch.target });

    if (!planet.length) {
        throw new Error('No matching planet found');
    }

    const newFlightNumber = await getLatestFlightNumber(launch) + 1;
    const newLaunch =  Object.assign(launch, {
                ...launch, 
                success: true,
                upcoming: true,
                customers: ['NASA', 'ZTM', 'RICARDO', 'COMAIR'],
                flightNumber: newFlightNumber
            });

    await saveLaunch(newLaunch);
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    loadLaunchesData
}
