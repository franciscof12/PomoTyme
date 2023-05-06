import express from 'express';
import { sequelize } from '../loadSequelize.js';
import { Usuario } from '../ modelos/Models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const router = express.Router();

// Registro de un nuevo usuario
router.post('/register', async (req, res) => {
  // Validaciones aquí (si es necesario)

  // Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Crear y guardar el usuario
  try {
    const newUser = await Usuario.create({ ...req.body, password: hashedPassword });
    res.json({ ok: true, data: newUser });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await Usuario.findOne({ where: { email } });

      console.log("Usuario encontrado:", user);

      if (!user) {
          return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          return res.status(401).json({ ok: false, error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.json({ ok: true, token });
  } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
  }
  
});



// Obtener todos los usuarios
router.get('/', (req, res, next) => {
  sequelize.sync().then(async () => {
    try {
      const usuarios = await Usuario.findAll();
      res.json({ ok: true, data: usuarios });
    } catch (error) {
      res.json({ ok: false, error: error.message });
    }
  });
});

// Obtener un usuario por ID
router.get('/:id', (req, res, next) => {
  sequelize.sync().then(async () => {
    try {
      const usuario = await Usuario.findOne({ where: { id: req.params.id } });
      res.json({ ok: true, data: usuario });
    } catch (error) {
      res.json({ ok: false, error: error.message });
    }
  });
});

// Crear un nuevo usuario
router.post('/', (req, res, next) => {
  sequelize.sync().then(async () => {
    try {
      const nuevoUsuario = await Usuario.create(req.body);
      res.json({ ok: true, data: nuevoUsuario });
    } catch (error) {
      res.json({ ok: false, error: error.message });
    }
  });
});

// Actualizar un usuario por ID
router.put('/:id', (req, res, next) => {
  sequelize.sync().then(async () => {
    try {
      const usuario = await Usuario.findOne({ where: { id: req.params.id } });
      const usuarioActualizado = await usuario.update(req.body);
      res.json({ ok: true, data: usuarioActualizado });
    } catch (error) {
      res.json({ ok: false, error: error.message });
    }
  });
});

// Eliminar un usuario por ID
router.delete('/:id', (req, res, next) => {
  sequelize.sync().then(async () => {
    try {
      const resultado = await Usuario.destroy({ where: { id: req.params.id } });
      res.json({ ok: true, data: resultado });
    } catch (error) {
      res.json({ ok: false, error: error.message });
    }
  });
});

export default router;
