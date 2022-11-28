const e = require('express');
const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    it('it should respond with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200)
        
    })
})

describe('Test POST /launches', () => {

    const completeLaunchData = {
        mission: 'Aloha Express', 
        rocket : 'AE-9900', 
        launchDate : 'January 14, 2044', 
        target: 'Kepler-186 f',
    }

    const completeLaunchDataWithInvalidDate = {
        mission: 'Aloha Express', 
        rocket : 'AE-9900', 
        launchDate : 'Wrong Date', 
        target: 'Kepler-186 f',
    }

    const incompleteLaunchData = {
        mission: 'Aloha Express', 
        rocket : 'AE-9900', 
        target: 'Kepler-186 f' 
    }

    it('it should respond with 200 success', async () => {
        const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

        const responseDate =  new Date(response.body.details.launchDate).valueOf();
        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body.details).toMatchObject(incompleteLaunchData); 
    })

    test('it should catch missing required properties', async () => {
        const response = await request(app)
        .post('/launches')
        .send(incompleteLaunchData)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Missing required launch property'
        })
    })

    it('It should catch invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(completeLaunchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid launch date'
        })
    })
})