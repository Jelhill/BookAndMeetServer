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
        // console.log("Form Inputs", formInputs)
        const formKeys = Object.keys(formInputs)
        const formValues = Object.values(formInputs)
        // console.log(formValues)
        // console.log(`UPDATE rooms SET (${formKeys.toString()}) = (${formValues.map(elem => typeof elem === "string" ? `'${elem}'` : elem)}) WHERE id = ${id}`)
        db.query(`UPDATE rooms SET (${formKeys.toString()}) = (${formValues.map(elem => typeof elem === "string" ? `'${elem}'` : elem)}) WHERE id = ${id}`) 
        .then((result) => {
            resolve({message: "success", result})
        })            
        .catch((error) => {
            // console.log(error)
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
module.exports = Room