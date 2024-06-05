const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
let refreshTokens = [];
const authContronllers ={
    //register
    registerUser: async(req, res)=>{
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            //create user
            const newUser = new User({
                username:req.body.username,
                email:req.body.email,
                password:hashed,
                role: req.body.role,
                vnu_id: req.body.vnu_id,
                gender:req.body.gender,
                phonenumber:req.body.phonenumber,
            });

            const user = await newUser.save();
            res.status(200).json(user);

        } catch (error) {
            res.status(500).json(error)
        }
    },
    // create token
    generateAccessToken:(user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin,
            role: user.role
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "1h"}
        );
    },

    generateRefreshToken:(user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin,
            role: user.role
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "365d"}
        );

    },
    //login
        loginUser: async(req, res)=>{
            try {
                const user = await User.findOne({username: req.body.username});
                if(!user){
                   return res.status(404).json('wrong username');
                }
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if(!validPassword){
                    return res.status(404).json('wrong password');
                }
                if(user && validPassword){
                    const accessToken= authContronllers.generateAccessToken(user);
                    const refreshToken= authContronllers.generateRefreshToken(user);
                    refreshTokens.push(refreshToken);
                    res.cookie("refreshToken", refreshToken,{
                        httpOnly: true,
                        secure: false,
                        path:'/',
                        sameSite:'strict',
                    })
                    const {password, ...orther}= user._doc;
                    res.status(200).json({...orther,accessToken});
                }
            } catch (error) {
                res.status(500).json(error);
            }
        },

        requestRefreshToken: async (req, res) => {
            //Take refresh token from user
            const refreshToken = req.cookies.refreshToken;
            //Send error if token is not valid
            if (!refreshToken) return res.status(401).json("You're not authenticated");
            if (!refreshTokens.includes(refreshToken)) {
              return res.status(403).json("Refresh token is not valid");
            }
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
              if (err) {
                console.log(err);
              }
              refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
              //create new access token, refresh token and send to user
              const newAccessToken = authContronllers.generateAccessToken(user);
              const newRefreshToken = authContronllers.generateRefreshToken(user);
              refreshTokens.push(newRefreshToken);
              res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure:false,
                path: '/',
                sameSite: "strict",
              });
              res.status(200).json({
                accessToken: newAccessToken
              });
            });
          },

        // logout
        userLogoutContronller: async(req, res)=>{
            res.clearCookie('refreshToken');
            refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
            res.status(200).json('Logout SuccessFully')
        }
}
module.exports = authContronllers;