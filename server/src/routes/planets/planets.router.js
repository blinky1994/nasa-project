const { getAllPlanets } = require('./planets.controller.js');

const express = require('express');

const planetsRouter = express.Router();

planetsRouter.get('/planets', getAllPlanets);

module.exports = planetsRouter;