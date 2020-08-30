const { validate } = require("jsonschema")
const dataSchema = require("../Schema/userScheme.json")
const bcrypt = require("bcrypt")
const db = require('../config/db')

function Room(data) {
    console.log(data)
    this.data = data
    this.errors = []
}

Room.prototype.validate = async function(){    
    const cleanData = validate(this.data, dataSchema)
    const { email } =  this.data

    if(!cleanData.valid) {       
        const err = cleanData.errors.map(err => err.stack)
        this.errors = err
        return err
    }

    return cleanData.instance
}

Room.prototype.fetchRoom = function() {
    return new Promise(async (resolve, reject) => {
        await db.query("SELECT * FROM rooms").then((result)=> {
            if(result.rows) {
                resolve({message: "Successful", rooms: result.rows})
            }
        })
        .catch((error) => {
            reject("Unable to fetch Data from database")
        })
    })
}

Room.prototype.deleteRoomById = function() {
    return new Promise(async (resolve, reject) => {  
        db.query("DELETE FROM rooms WHERE id = $1", [this.data]).then((result)=> {
            resolve(result)
        })
        .catch((error) => {
            reject("Unable to Delete Data from database")
        })
    })
}

Room.prototype.editRoomById = function() {
    return new Promise(async (resolve, reject) => { 
        const { formInputs, id } = this.data
        const formKeys = Object.keys(formInputs)
        const formValues = Object.values(formInputs)
        db.query(`UPDATE rooms SET (${formKeys.toString()}) = (${formValues.map(elem => typeof elem === "string" ? `'${elem}'` : elem)}) WHERE id = ${id}`) 
        .then((result) => {
            resolve({message: "success", result})
        })            
        .catch((error) => {
            reject("Unable to Edit Data from database")
        })
    })
}

Room.prototype.getRoomById = function() {
    return new Promise((resolve, reject) => {
            db.query("SELECT * FROM rooms WHERE id = $1", [this.data])
            .then((result) => {
                if(result){
                    resolve({message: "Successful", result: result.rows[0]})
                }
                else{
                    reject("No data to Fetch")
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

Room.prototype.searchRoomByFilter = function() {
    return new Promise((resolve, reject) => {
        const {type, capacity, searchDate, searchTime} = this.data
        let newCapacity = capacity === undefined ? "unselected" : capacity
        console.log("capacity", newCapacity)
        let maximum = 0
        switch(newCapacity) {
            case "maxTen":
                maximum = 10
                break;
            case "maxFifty":
                maximum = 50
                break;
            case "maxOneHundred":
                maximum = 100
                break;
            case "maxTwoHundred":
                maximum = 200
                break;
            case "aboveTwoHundred":
                maximum = 1000
                break;
            case "unselected":
                maximum = 1000
                break;
            default: 
                maximum = 0;
        }

        db.query("SELECT * FROM rooms WHERE type = $1 AND capacity <= $2", [type, maximum])
        .then((result) => {
            console.log("Res", result)
            if(result){
                resolve({status: "success", data: result.rows})
            }
            else{
                reject("No data to Fetch")
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}
module.exports = Room
