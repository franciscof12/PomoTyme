//importamos/requerimos express y controladores
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();


import tareasRouter from './rutas/tareasRouter.js';
import indexRouter from './rutas/indexRouter.js';
import usuarioRouter from './rutas/usuarioRouter.js';
import pomodorosRouter from './rutas/pomodorosRouter.js';
import authMiddleware from "./rutas/authMiddleware.js";


//instanciamos nueva aplicación express
const app = express();

//necesario para poder recibir datos en json
app.use(express.json());
app.use(cors());


//las rutas que empiecen por /api/articles se dirigirán a articlesRouter
app.use("/", indexRouter);
app.use("/api", indexRouter);
app.use("/api/tareas", authMiddleware, tareasRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/pomodoros", authMiddleware, pomodorosRouter);


//arranque del servidor
const port = 3000
app.listen(port, () => console.log(`App listening on port ${port}!`))
