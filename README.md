# QAS Project
To start server run: node app.js
### Project creation steps
- Create an Express server, executes running: "npm start" or "node app.js" commands.
- Dockerize Express server (to debug locally run "npm start" and add an "Attack by process ID" in VS).
    Build: docker build -t express-server .
    Run: docker run --rm -d --name express-server-container -p 3000:3000 express-server
- Dockerize Mongodb:
    Run: docker run --rm -d --name mongodb -p 27017:27017 mongo
- Docker compose application. Run together express server and mongodb.
