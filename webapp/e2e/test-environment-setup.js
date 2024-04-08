const {sequelize} = require('../../services/user-model.js');

let userservice;
let gatewayservice;

async function startServer() {
    process.env.NODE_ENV === 'test'
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    console.log('Starting MariaDB Connection...');
    userservice = await require("../../users/userservice/user-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");

    
  }

  startServer();