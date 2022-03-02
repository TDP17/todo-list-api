import Sequelize from 'sequelize';
import sequelize from "../Utils/database.js";

const User = sequelize.define("User", {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true    
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false    
    }
});

export default User;