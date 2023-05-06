import express from 'express';
import { sequelize } from "../loadSequelize.js";
import { Tarea } from '../ modelos/Models.js';
import authMiddleware from './authMiddleware.js';




const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
    try {
      const tareas = await Tarea.findAll({ where: { id_usuario: req.usuario.id } });
      res.json({ ok: true, data: tareas });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });


// GET de un solo article
router.get('/:id', authMiddleware, function (req, res, next) {
    sequelize.sync().then(() => {

        Tarea.findOne({ where: { id: req.params.id } })
            .then(al => res.json({
                ok: true,
                data: al
            }))
            .catch(error => res.json({
                ok: false,
                error: error
            }))

    }).catch((error) => {
        res.json({
            ok: false,
            error: error
        })
    });
});



// POST, creacion de nueva tarea
router.post('/', authMiddleware, function (req, res, next) {
    sequelize.sync().then(() => {
      Tarea.create({ ...req.body, id_usuario: req.usuario.id })
        .then((item) => res.json({ ok: true, data: item }))
        .catch((error) => res.json({ ok: false, error: error.message }))
    }).catch((error) => {
      res.json({
        ok: false,
        error: error.message
      })
    });
  });
  

// put modificacion de nueva tarea
router.put('/:id', authMiddleware, function (req, res, next) {
    sequelize.sync().then(() => {

        Tarea.findOne({ where: { id: req.params.id } })
            .then(tarea_encontrada =>
                tarea_encontrada.update(req.body)
            )
            .then(tarea_modificada => res.json({
                ok: true,
                data: tarea_modificada
            }))
            .catch(error => res.json({
                ok: false,
                error: error.message
            }));

    }).catch((error) => {
        res.json({
            ok: false,
            error: error.message
        })
    });
});



// DELETE elimina tarea por id
router.delete('/:id', authMiddleware, function (req, res, next) {

    sequelize.sync().then(() => {

        Tarea.destroy({ where: { id: req.params.id } })
            .then((data) => res.json({ ok: true, data }))
            .catch((error) => res.json({ ok: false, error }))

    }).catch((error) => {
        res.json({
            ok: false,
            error: error
        })
    });

});


export default router;