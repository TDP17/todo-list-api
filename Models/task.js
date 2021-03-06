import Sequelize from 'sequelize';
import sequelize from "../Utils/database.js";

const Task = sequelize.define("Task", {
    label: {
        type: Sequelize.STRING,
        allowNull: false    
    },
    priority: {
        type: Sequelize.INTEGER,
        allowNull: false    
    },
    endTime: {
       type: Sequelize.BIGINT,
    }
});

export default Task;