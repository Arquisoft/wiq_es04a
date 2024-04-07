let sequelize;
let userservice;

async function startServer() {
    try {
        process.env.NODE_ENV ='test';
        console.log('Starting MariaDB Connection...');
        userservice = await require("../../users/services/user-model");
        sequelize = userservice.sequelize;
    
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    
        
    } catch (error) {
        console.error('Error starting server:', error);
    }
   
  }

  startServer();