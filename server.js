const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

//TIP: to develop the backend without having to restart the server everytime:
//install nodemon and add to scripts in package.json file.
//Start the server with 'npm run start:server'

//to make sure the port is a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

//error handler
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//just stats to show when server successfully listening
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

//port from environment or 3000
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//server.listen to start the server after all checks
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
