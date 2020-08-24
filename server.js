const express = require("express")
const cors = require("cors")

const morgan = require("morgan")
const router = require("./routes/router")
const app = express()


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(morgan("tiny"))
app.use("/uploads", express.static("uploads"))



if (app.get("env") === "development"){
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        return res.json({   
            message: err.message,
            error: err
        })
    })
}
app.use("/", router)
const port = 3001 || process.env.PORT
app.listen(port, () => console.log(`App Started on port ${port}`))
module.exports = app