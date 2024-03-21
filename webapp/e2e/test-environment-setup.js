////const { MongoMemoryServer } = require('mongodb-memory-server');
const userMemoryDatabase = require('mysql2-promise')();

//let mongoserver;
let userservice;
let gatewayservice;
let con;

async function startServer() {
    //console.log('Starting MongoDB memory server...');
    //mongoserver = await MongoMemoryServer.create();
    //const mongoUri = mongoserver.getUri();
    //process.env.MONGODB_URI = mongoUri;

    const mariadbConfig = {
        host: 'localhost',
        user: 'root',
        database: 'base_de_datos_de_usuarios',
        memory: true
    };
    //con = await userMemoryDatabase.createConnection(mariadbConfig);

    userMemoryDatabase.configure({
        "host": "mariadb",
        "user": "foo",
        "password": "bar",
        "database": "base_de_datos_de_usuarios"
    });

    userservice = await require("../../users/index");
    gatewayservice = await require("../../gatewayservice/gateway-service");
  }

  startServer();
