const launches = new Map();

let latestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    const newLaunch =  Object.assign(launch, {
        ...launch, 
        success: true,
        upcoming: true,
        customers: ['NASA', 'ZTM', 'RICARDO', 'COMAIR'],
        flightNumber: latestFlightNumber
    });
    launches.set(latestFlightNumber, newLaunch);
    return newLaunch;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById
}
