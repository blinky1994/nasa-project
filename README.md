# nasa-project
Mission scheduler built using React, NodeJS, Express. Upcoming launches are stored in MongoDB database using Mongoose. This project is primarily 
focused on the backend so an existing stlye library is used for the front end to provide the futuristic theme.

![nasa-mission-control](https://user-images.githubusercontent.com/56903269/209966957-e5b9ae3b-4dff-482f-9837-bfe3d04441a7.png)

# Planets data
I initially obtained NASA's Space Telescope Data from https://exoplanetarchive.ipac.caltech.edu/docs/data.html and used the FileSystem to parse the 
data from excel, filter the planets based on habitable conditions (such as Planetary radius < 1.6 times Earth's radius), and stored the list of planets
in an array.

Later, I created a `/planets` endpoint in my Node Express server to fetch the data.

# Launches data
I created a `/launches` endpoint to fetch launches which are just objects that include these properties: `flightNumber`, `mission`, `rocket` and more.

# Storing planets and launches data
MongoDB is used to store the planets and launches data and I used Mongoose as a way to provide a schema for my data in order to keep the structure
consistent.

# Deployment
The frontend is built with React and served by the Node server. Everything is then contained in a docker container and the docker image is pushed to
Docker's repo. Later I created a AWS EC2 server instance and installed the whole application from the docker image there.

