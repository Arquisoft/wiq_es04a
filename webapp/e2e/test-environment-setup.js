let sequelize;
let userservice;
let gatewayservice;
let questionservice;

async function startServer() {
    try {
        process.env.NODE_ENV ='test';
        console.log('Starting MariaDB Connection...');
        userservice = await require("../../users/services/user-model");
        sequelize = userservice.sequelize;
        gatewayservice = await require("../../gatewayservice/gateway-service");
        questionservice = await require("../../questions/services/question-data-service");
    
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    
        
    } catch (error) {
        console.error('Error starting server:', error);
    }
   
  }

  startServer();