const http = require('http');
const { app } = require('./app');
const connectDB = require('./util/DBConnect');
const { initWebSocket } = require('./socket');
require('dotenv').config({path: './.env'})


const APP_SERVER_PORT = process.env.APP_SERVER_PORT;

const server = http.createServer(app);

initWebSocket(server);

(async () => {
  await connectDB().catch(error=> {console.log(error)});
})();

server.listen(APP_SERVER_PORT, () => {
    console.log('Server listening to PORT:',APP_SERVER_PORT);
})