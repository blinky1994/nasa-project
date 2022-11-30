const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    // Set by server
    flightNumber: 100, 
    customers: ['NASA', 'ZTM', 'RICARDO', 'COMAIR'],
    upcoming: true,
    success: true,

    // Provided by client
    mission: 'Uranus Exploration XXX', 
    rocket: 'Explorer IS69',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b'
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({ flightNumber: launchId })
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


async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '__v': 0, // Exclude version key
        '_id': 0 // Exclude Object ID
    });
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
    const planet = await planets.find({ keplerName: launch.target });

    if (!planet.length) {
        throw new Error('No matching planet found');
    }

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

async function scheduleNewLaunch(launch) {
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
    abortLaunchById
}
