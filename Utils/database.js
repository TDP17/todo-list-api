import Sequelize from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    // Uncomment this out on production db, comment on deployment db - no clue why
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }, 
    logging: false
});

export default sequelize;