const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysqlnode', 'root', '' ,{
    host: 'localhost', 
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectado com Sucesso!');
} catch (err) {
    console.log(`Não conectado ${err}`);
}

module.exports = sequelize;