import express from 'express';
import { Sesiones_Pomodoro, Usuario } from '../ modelos/Models.js';
import authMiddleware from './authMiddleware.js';
import { Sequelize } from 'sequelize';

const router = express.Router();

// Obtener todas las sesiones de pomodoro del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sesiones = await Sesiones_Pomodoro.findAll({ 
      where: { id_usuario: req.usuario.id },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['password'] }
        }
      ]
    });
    res.json({ ok: true, data: sesiones });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Crear una nueva sesión de pomodoro
router.post('/', authMiddleware, async (req, res) => {
  try {
    const sesion = await Sesiones_Pomodoro.create({ 
      ...req.body,
      id_usuario: req.usuario.id 
    });
    res.json({ ok: true, data: sesion });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
