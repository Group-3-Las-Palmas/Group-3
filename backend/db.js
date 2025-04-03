import { Sequelize } from "sequelize";

const sequelize = new Sequelize("lumo", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Successful connection to MySQL with Sequelize'))
    .catch(error => console.error('Connection error:', error));

export default sequelize;