const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches (req , res) {
    res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || 
        !launch.rocket || 
        !launch.launchDate || 
        !launch.target
        ) {
        return res.status(400).json({
            error: 'Missing required launch property'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        });
    }


    const addedLaunch = addNewLaunch(launch);
    res.status(201).json({
        message: 'Successful',
        details: addedLaunch
    })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}