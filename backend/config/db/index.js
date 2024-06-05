const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/students-managements',{
        });
        console.log('connect sucessfully!!!')
    } catch (error) {
        console.log('connect fail!!!')

    }
}

module.exports = {connect};