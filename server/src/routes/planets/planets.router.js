const { httpGetAllPlanets } = require('./planets.controller.js');

const express = require('express');

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;