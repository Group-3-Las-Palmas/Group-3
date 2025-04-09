import { Sequelize } from "sequelize";

const sequelize = new Sequelize("lumo", "root", "1234", {
  //Without docker
  // host: "localhost",
  //docker
  host: "host.docker.internal",
  dialect: "mysql",
  logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Successful connection to MySQL with Sequelize'))
    .catch(error => console.error('Connection error:', error));

export default sequelize;