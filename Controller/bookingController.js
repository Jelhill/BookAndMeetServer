const Booking = require("../Model/Booking")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET


exports.bookRoom = (req, res) => {
    console.log("req body", req.body)
    const booking = new Booking(req.body)
    booking.bookNow()
    .then(() => {
        res.send({message: "Successfully Booked"})})
    .catch((error) => {res.send({message: error})})
}


