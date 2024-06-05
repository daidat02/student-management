const User= require('../models/User');

const userContronller = {
    getAllUsers: async(req, res)=>{
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteUser: async(req, res)=>{
        try {
            const user = await User.findById();
            res.status(200).json('delete successfully!!');
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports= userContronller;