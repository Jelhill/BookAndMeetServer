const Room = require("../Model/Room")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET


exports.getRoom = (req, res) => {
    const room = new Room(req.body)
    room.fetchRoom()
    .then((result) => {
        res.send({message: "Room Added Successfully", rooms: result.rooms})})
    .catch((error) => {res.send({message: error})})
}

exports.deleteRoom = (req, res) => {
    const { id } = req.params
    const room = new Room(id)
    room.deleteRoomById()
    .then(() => res.send({message: "Room Deleted Successfully"}))
    .catch((error) => res.send({message: error}))
}

exports.getRoomDetails = (req, res) => {
    const { id } = req.params
    const room = new Room(id)
    room.getRoomById()
    .then((response) => res.send({message: "success", response}))
    .catch((err) => res.send({message: err}))
}

exports.editRoom = (req, res) => {
    const { id } = req.params
    const data = {formInputs: req.body, id}
    const room = new Room(data)
    room.editRoomById()
    .then((result) => {
        console.log("TJB", result)
        res.send({message: "Room Edited Successfully"})
    })
    .catch((error) => res.send({message: error}))
}

exports.booking = (req, res) => {
    const { id } = req.params
    const room = new Room(id)
    room.getRoomById()
    .then((data) => res.send({message: "success", data}))
    .catch((err) => res.send({message: err}))
}

exports.searchRoom = (req, res) => {
    const room = new Room(req.body)
    room.searchRoomByFilter()
    .then((data) => res.send({status: "success", data}))
    .catch((err) => res.send({err}))
}