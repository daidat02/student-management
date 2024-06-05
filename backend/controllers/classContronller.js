const  Classroom = require('../models/ClassSchema');
const mongoose = require('mongoose');
const User = require('../models/User');
const ObjectId = mongoose.Types.ObjectId
const classContronller = {
    createClassroom: async(req, res)=>{
        if (req.user.role !== "teacher") {
            console.log('Permission denied: role != teacher');
            return res.status(403).json({
                status: "Error",
                message: "Permission Denied, role != teacher nhưng lại tạo class ???"
            });
        }
        
        try {
            const newClass = new Classroom({
                class_id: req.body.class_id,
                class_name: req.body.class_name,
                teacher: new ObjectId(req.user._id), 
            });

            const savedClass= await newClass.save();
            return res.status(200).json(savedClass);
        } catch (error) {
           return res.status(500).json(error);
        }
    },

    getClass: async(req, res)=>{
        try {
            const getClass =await Classroom.find();
            res.status(200).json(getClass);
        } catch (error) {
            res.status(500).json(error);
        }
    },
   
    findClassById: async (req, res, next) => {
        const classId = req.params.classId;
        try {
            console.log('Finding class with ID:', classId); // Thêm log ở đây để ghi lại thông tin về lớp được tìm kiếm
            const classInstance = await Classroom.findOne({ class_id: classId });
            if (!classInstance) {
                console.log('Class not found with ID:', classId); // Ghi lại thông tin nếu không tìm thấy lớp
                return res.status(404).json({ message: 'Class not found' });
            }
            console.log('Class found:', classInstance); // Ghi lại thông tin nếu tìm thấy lớp
            req.classInstance = classInstance;
            next(); // Đảm bảo rằng bạn gọi next() ở đây
        } catch (error) {
            console.error('Error while finding class:', error); // Ghi lại thông tin nếu có lỗi xảy ra
            return res.status(500).json(error);
        }
    },
    deleteClass: async (req, res) => {
        try {
            const classInstance = req.classInstance;
            if (!classInstance) {
                return res.status(404).json('Class not found');
            }

            await Classroom.deleteOne({ class_id: classInstance.class_id }); // Sử dụng deleteOne để xóa lớp học
            return res.status(200).json('Delete class successfully');
        } catch (err) {
            console.error('Error while deleting class:', err); // Ghi log lỗi chi tiết
            return res.status(500).json('Delete failed');
        }
    },

    addStudentToClass: async (req, res) => {
        try {
            const studentId = req.body.studentId; // Lấy ID sinh viên từ req.body
           console.log('Student ID:', studentId); // Ghi lại thông tin về ID sinh viên 
            const student = await User.findById(studentId);
            if (!student || student.role !== 'student') {
                console.log('User is not a student or not found'); // Ghi lại thông tin nếu người dùng không phải là sinh viên hoặc không tìm thấy
                return res.status(404).json('User is not a student');
            }

            const classInstance = req.classInstance; // Lấy classInstance từ req
            console.log('Class instance:', classInstance); // Ghi lại thông tin về instance của lớp

            // Kiểm tra xem sinh viên đã có trong lớp hay chưa
            if (classInstance.students.includes(studentId)) {
                console.log('Student is already in the class'); // Ghi lại thông tin nếu sinh viên đã có trong lớp
                return res.status(400).json('Student is already in the class');
            }

            // Thêm sinh viên vào lớp
            classInstance.students.push(studentId);

            await classInstance.save();
            console.log('Student added to class successfully'); // Ghi lại thông tin nếu sinh viên được thêm vào lớp thành công
            return res.status(200).json(classInstance);
        } catch (error) {
            console.error('Error while adding student to class:', error); // Ghi lại thông tin nếu có lỗi xảy ra
            return res.status(500).json(error);
        }
    },

    getStudentInClass: async(req, res)=>{
        const classInstance = await req.classInstance.populate('students');
        let limit = req.query.limit;
        if (limit > classInstance.students.length) limit = classInstance.students.length;
        let classMembers = classInstance.students.slice(0, limit);
        res.status(200).json(classMembers);
    },
    
    deleteStudent: async(req, res)=>{
        try {
            const studentId = req.params.studentId; // lấy id từ req.params
            const classInstance = req.classInstance; // lấy classItstance từ req.Instance

            const studentIndex = classInstance.students.indexOf(studentId); // kiểm tra student có tồn tại trong class ??

            if(studentIndex == -1){
                return res.status(404).json('student not found class');
            }
            
            classInstance.students.splice(studentIndex,1); //xóa student
            await classInstance.save(); 

            return res.status(200).json('delete student success');

        } catch (error) {
            res.status(500).json('delete failed');
        }
    }

    
}

module.exports= classContronller;