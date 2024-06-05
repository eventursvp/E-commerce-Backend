// const jwt = require('jsonwebtoken');
// const User = require('../Model/userModel');
// const DeliveryBoy = require("../Model/deliveryBoyModel")

// exports.jwtValidation = async (req, res, next) => {
//     try {
//         const token = req.headers['x-access-token'];
//         if (token) {
//             jwt.verify(token, process.env.JWT_TOKEN, async function (error, decoded) {
//                 if (error) {
//                     return res.status(401).send({
//                         status: 0,
//                         isAuthenticated: false,
//                         message: "Session expired. Please Login again."
//                     });
//                 } else if (!decoded.hasOwnProperty('email') || !decoded.hasOwnProperty('id') || !decoded.hasOwnProperty('role')) {
//                     return res.status(400).send({ status: 0, message: "Invalid token" })
//                 }
//                 else {
//                     if (decoded?.role === "DeliveryBoy") {
//                         let findUser = await DeliveryBoy.findOne({ email: decoded.email.toLowerCase() });
//                         if (findUser) {
//                             if (findUser.isLoggedOut === true) {
//                                 return res.status(401).send({ status: 0, message: "Please Login Again" })
//                             } else if (findUser.emailVerified === false) {
//                                 return res.status(401).send({ status: 0, message: "Please verify your email" })
//                             }
//                             req.loginUser = findUser;
//                             next();
//                         } else {
//                             return res.status(401).send({ status: 0, message: "Unauthorized access." })
//                         }
//                     }
//                     let findUser = await User.findOne({ email: decoded.email.toLowerCase() });
//                     if (findUser) {
//                         if (findUser.role !== "Admin") {
//                             if (findUser.isLoggedOut === true) {
//                                 return res.status(401).send({ status: 0, message: "Please Login Again" })
//                             } else if (findUser.emailVerified === false) {
//                                 return res.status(401).send({ status: 0, message: "Please verify your email" })
//                             }
//                         }
//                         req.loginUser = findUser;
//                         next();
//                     } else {
//                         return res.status(401).send({ status: 0, message: "Unauthorized access." })
//                     }
//                 }
//             });
//         } else {
//             return res.status(400).send({ message: "Please provide valid token." })
//         }
//     }
//     catch (error) {
//         console.log(error);
//         return res.send({ status: 0, message: "Something went wrong.", error });
//     }
// }


const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const DeliveryBoy = require("../Model/deliveryBoyModel");

exports.jwtValidation = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, process.env.JWT_TOKEN, async (error, decoded) => {
                if (error) {
                    return res.status(401).send({
                        status: 0,
                        isAuthenticated: false,
                        message: "Session expired. Please login again."
                    });
                }

                const { email, id, role } = decoded;

                if (!email || !id || !role) {
                    return res.status(400).send({ status: 0, message: "Invalid token." });
                }

                let findUser;
                if (role === "DeliveryBoy") {
                    findUser = await DeliveryBoy.findOne({ email: email.toLowerCase() });
                    if (!findUser) {
                        return res.status(401).send({ status: 0, message: "Unauthorized access." });
                    }
                    if (findUser?.isDeactive === true) {
                        return res.status(400).send({ status: 0, message: "Admin deactive your account, you can get access after admin active your account." })
                    }
                    if (findUser.isLoggedOut) {
                        return res.status(401).send({ status: 0, message: "Please login again." });
                    }
                    if (!findUser.emailVerified) {
                        return res.status(401).send({ status: 0, message: "Please verify your email." });
                    }
                } else {
                    findUser = await User.findOne({ email: email.toLowerCase() });
                    if (!findUser) {
                        return res.status(401).send({ status: 0, message: "Unauthorized access." });
                    }
                    if (role !== "Admin") {
                        if (findUser.isLoggedOut) {
                            return res.status(401).send({ status: 0, message: "Please login again." });
                        }
                        if (!findUser.emailVerified) {
                            return res.status(401).send({ status: 0, message: "Please verify your email." });
                        }
                    }
                }

                req.loginUser = findUser;
                next();
            });
        } else {
            return res.status(400).send({ message: "Please provide valid token." })
        }

    } catch (error) {
        console.log(error);
        return res.send({ status: 0, message: "Something went wrong.", error });
    }
}
