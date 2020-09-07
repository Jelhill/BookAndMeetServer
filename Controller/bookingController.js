const Booking = require("../Model/Booking")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET


exports.bookRoom = (req, res) => {
    const booking = new Booking(req.body)
    booking.bookNow()
    .then(() => res.send({status: "success"}))
    .catch(error => res.send({message: error}))
}

exports.getBookings = (req, res) => {
    const booking = new Booking()
    booking.fetchBookings()
    .then((data) => {    
        console.log(">>>", data)
        res.send({status: "success", data})})
    .catch(error => res.send({status: "failed", error}))
}

