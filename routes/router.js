const express = require("express")
const router = express.Router()
const userController = require("../Controller/userController")
const adminController = require("../Controller/adminController")
const roomController = require("../Controller/roomController")
const bookingController = require("../Controller/bookingController")
// const adminRegController = require("../Model/AdminPersonnel")
const feedbackController = require("../Model/Feedback")
require('dotenv').config()
const verify = require("../middleware/verify")


 

// GET REQUESTS
router.get("/", (req, res) => res.json("Welcome to Home"))
router.get("/booking/:id", roomController.booking)
router.get("/getRooms", roomController.getRoom)
router.get("/getRoomDetails/:id", roomController.getRoomDetails)
router.get("/feedbackComments", userController.feedbackComments);

// POST REQUEST
router.post("/signUp", userController.userSignUp);
router.post("/login", userController.login);
router.post("/addRoom", adminController.addRoom);
router.post("/adminsignup", adminController.adminSignUp);
router.post("/adminLogin",adminController.adminLogin);

// router.get("/booking", verify, userController.booking);
router.post("/feedback", feedbackController.feedBack)
router.post("/searchRoom", roomController.searchRoom)
//PATCH REQUEST
router.patch("/addRoom/:id", adminController.editRoom)
router.post("/bookRoom", bookingController.bookRoom)
router.put("/editRoom/:id", roomController.editRoom)
router.delete("/deleteRoom/:id", roomController.deleteRoom)


module.exports = router