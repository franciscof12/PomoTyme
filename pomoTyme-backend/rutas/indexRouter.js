import express from 'express';

const router = express.Router();




router.get('/', function (req, res, next) {
    res.end("PomoTyme API");
});




export default router;
