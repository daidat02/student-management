const jwt = require('jsonwebtoken');

const middlewareContronller ={
    // vertifytoken
    vertifyToken:(req,res,next)=>{
        const token= req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY,(err, user)=>{
                if(err){
                   return res.status(403).json('token is not valid');
                }
                req.user=user;
                console.log('Token verified, user:', user);
                next();
            });
        }
        else{
           return res.status(401).json('You are not authentication');
        }
    },

    vertifyTokenAdmin:(req, res,next)=>{
        middlewareContronller.vertifyToken(req,res, (er)=>{
            if(req.user.id == req.params.id || req.user.admin){
                next();
            }
            else{
               return res.status(403).json("You are not an admin");
            }
        })
    },
    vertifyTokenTeacher:(req, res, next)=>{
        middlewareContronller.vertifyToken(req,res,()=>{
            if(req.user.role == 'teacher'){
                next();
            }
            else{
                return res.status(403).json("you are not an teacher");
            }
        })
    }
}

module.exports=middlewareContronller;