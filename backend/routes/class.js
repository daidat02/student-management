const classContronller = require('../controllers/classContronller');
const middlewareContronller = require('../controllers/middlewareContronller')
const router = require('express').Router();

router.get('/',middlewareContronller.vertifyToken, classContronller.getClass);
router.post('/create',middlewareContronller.vertifyToken, classContronller.createClassroom)
router.delete('/:classId',middlewareContronller.vertifyToken,middlewareContronller.vertifyTokenTeacher,classContronller.findClassById, classContronller.deleteClass);

router.get('/:classId/',middlewareContronller.vertifyToken,middlewareContronller.vertifyTokenTeacher, classContronller.findClassById, classContronller.getStudentInClass);
router.post('/:classId/addStudent',middlewareContronller.vertifyToken, middlewareContronller.vertifyTokenTeacher ,classContronller.findClassById, classContronller.addStudentToClass);
router.delete('/:classId/:studentId',middlewareContronller.vertifyToken, middlewareContronller.vertifyTokenTeacher ,classContronller.findClassById, classContronller.deleteStudent);

module.exports= router;
