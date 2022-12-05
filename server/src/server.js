const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');
const { mongoConnect } = require('./services/mongo');

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(process.env.PORT || 8000, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
}

startServer();

