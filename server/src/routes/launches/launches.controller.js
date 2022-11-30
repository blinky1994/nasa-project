const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');
const { getPaginate } = require('../../services/query');

async function httpGetAllLaunches (req , res) {
    const { skip, limit } = getPaginate(req.query);
    res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
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

    await scheduleNewLaunch(launch);

    res.status(201).json({
        message: 'Successful',
        details: launch
    })
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id); 

    const existLaunch = await existsLaunchWithId(launchId);
    //if launch does not exist
    if (!existLaunch) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    }

    const aborted = await abortLaunchById(launchId);

    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        });
    }

    return res.status(200).json({
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}