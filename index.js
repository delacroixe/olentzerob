const axios = require("axios")
const cheerio = require("cheerio")
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser");

const port = 8000

app.use(cors())
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.post('/', function (req, res) {

    let body = req.body
    if (body !== undefined) {
        if (body.url !== "") {
            if (body.url.includes("www.milanuncios.com/")) {
                axios.get(body.url)
                    .then(response => {
                        res.send(scrapMilanuncios(response.data, body.url))
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).send({ error: error })
                    });
            } else {
                data = { null: null }
                res.send(data)
            }

        } else { res.status(400).send({ "error": "Empty url" }) }
    } else {
        res.status(400).send({ "error": "Empty body" })
    }
});

let getStringParentheses = (str) => {
    let regExp = /\(([^)]+)\)/
    var matches = regExp.exec(str)
    return matches[1]
}


let scrapMilanuncios = (data, url) => {
    const $ = cheerio.load(data)
    let loc = $(".pagAnuCatLoc").text()
    let seller = ''
    if ($(".pillSellerTypePro").text() !== '') {
        seller = $(".pillSellerTypePro").text()
    } else if ($(".pillSellerTypePriv").text() !== '') {
        seller = $(".pillSellerTypePriv").text()
    }
    let result = {
        "url": url,
        "title": $("h1.ad-detail-title").text(),
        "price": $(".pagAnuPrecioTexto").text().split(' ')[0],
        "location": getStringParentheses(loc),
        "seller": seller,
        "description": $(".pagAnuCuerpoAnu").text().substring(0, 200),
        "image": $(".pagAnuFoto").find('img').attr('src'),
        "cc": $(".cc").text().split(' ')[0],
        "year": $(".ano").text().split(' ')[1],
        "km": $(".kms").text().split(' ')[0]
    }
    console.log("data " + JSON.stringify(result))
    return result
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})





