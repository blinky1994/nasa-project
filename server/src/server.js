const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
const { loadPlanetsData } = require('./models/planets.model');

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready');
})
mongoose.connection.on('error', (err) => {
    console.error('Error trying to connect to MongoDB: ', err);
})

async function startServer() {
    await mongoose.connect(process.env.MONGO_URL);

    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();

