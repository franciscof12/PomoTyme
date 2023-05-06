import config from './config/config.js'
import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: "mysql"
    }
);

export const dataTypes = DataTypes;