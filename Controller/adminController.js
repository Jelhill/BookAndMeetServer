const Admin = require("../Model/Admin")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET


exports.addRoom = (req, res) => {
    const admin = new Admin(req.body)
    admin.addRoom()
    .then((result) => {res.json({message: "Room Added Successfully"})})
    .catch((error) => {res.json({message: error})})
}
exports.editRoom = (req, res) => {
    const editBoard = new Admin(req.body)
    editBoard.editRoom()
    .then((result) => {res.json({message: "Room Edited Successfully"})})
    .catch((error) => {res.json({message: error})})
}

exports.adminSignUp = (req, res) => {
    const admin = new Admin(req.body)
    admin.adminsignUp()
    .then((result) => {
        console.log(result)
        res.json({message: "Registered Successfully"})
    })
    .catch((error) => {res.json({message: error})})
}

exports.adminLogin = (req, res) => { 
    const admin = new Admin (req.body)
    admin.authenticateUser().then((response) => {
        const payload = {
            id: response.result.id,
            firstname: response.result.firstname
        }
        jwt.sign(payload, SECRET, {expiresIn: "600s"}, (err, token) => {
            if(err) res.send({message: "Failed"})
            res.send({message: "success", token, payload})
        })

    }).catch((err) => {
        res.send({message: err})
    })
}
