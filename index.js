const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser");
const products = require("./src/controller/productsCtrl")

const port = process.env.PORT || 80

app.use(cors())
app.use(bodyParser.json());

app.use('/products', products)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})