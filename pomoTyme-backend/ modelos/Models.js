import { dataTypes, sequelize } from "../loadSequelize.js";

export const seq = sequelize;

export const Usuario = sequelize.define('Usuario', {
    nombre: dataTypes.STRING,
    email: dataTypes.STRING, 
    password: dataTypes.STRING
}, { tableName: 'Usuarios', timestamps: false });


export const Tarea = sequelize.define('Tarea', {
    descripcion: dataTypes.STRING,
    categoria: dataTypes.STRING,
    id_usuario: dataTypes.INTEGER
}, { tableName: 'Tareas', timestamps: false });

export const Sesiones_Pomodoro = sequelize.define('Sesiones_Pomodoro', {
    id_usuario: dataTypes.INTEGER,
    tiempo_estudio: dataTypes.INTEGER,
    tiempo_descanso: dataTypes.INTEGER,
    fecha_inicio: dataTypes.DATE,
    fecha_fin: dataTypes.DATE
}, { tableName: 'Sesiones_Pomodoro', timestamps: false });

// Define las relaciones
Usuario.hasMany(Tarea, {
    foreignKey: 'id_usuario',
    as: 'tareas'
});

Tarea.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});
Sesiones_Pomodoro.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
  });
