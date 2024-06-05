const middlewareContronller = require('../controllers/middlewareContronller');
const userContronller = require('../controllers/userContronller');
const router = require('express').Router();

router.get('/',middlewareContronller.vertifyToken, userContronller.getAllUsers);
router.delete('/:id',middlewareContronller.vertifyTokenAdmin, userContronller.deleteUser);

module.exports= router;