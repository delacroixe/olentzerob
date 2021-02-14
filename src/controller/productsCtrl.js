const express = require('express')
const products = express.Router();
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');
const scrap = require("../tool/scraping")

const fakeResult = [
    { "url": "https://www.milanuncios.com/motos-de-carretera/yamaha-mt-125-abs-377182100.htm", "title": "YAMAHA - MT 125 ABS", "price": "3.600", "location": "ALICANTE", "seller": "Particular", "description": "Ruedas nuevas,  mantenimiento exaustivo,  perfecto estado,  muy cuidada . Color GRIS", "image": "https://img.milanuncios.com/fg/3771/82/377182100_1.jpg?VersionId=DaK9iCqOt8aHr58ygovVlFal6COQVxd9", "cc": "125", "year": "2019", "km": "16.000", "notifications": null },
    { "url": "https://es.wallapop.com/item/suzuki-bandit-400-590382032", "title": "suzuki bandit 400", "price": "2.500", "location": "Sant Jordi de Ses Salines", "seller": "Toni B.", "description": "Suzuki Bandit 400 del 91 en muy buen estado, varios extras y cuidada, siempre desde que estuvo conmigo en garage... limitada para carnet A2, precio algo negociable.", "image": "https://cdn.wallapop.com/images/10420/9r/hx/__/c10420p590382032/i1824514495.jpg?pictureSize=W640", "cc": "", "year": "", "km": "", "notifications": null },
    { "url": "https://www.milanuncios.com/motos-de-carretera/suzuki-gsf-650-bandit-n-373621443.htm", "error": "Somting happend with this product URL" }
]


const callUrlAndScrp = async products => {
    try {
        let result = []
        for (let index = 0; index < products.length; index++) {
            try {
                let response = await axios.get(products[index].url)
                result.push(scrap(response))
            } catch (error) {
                result.push({ "error": error, "origin": products[index].url })
            }
        }
        return result
    } catch (error) {
        return error
    }
}

const checkPriceNotification = (oldProducts, newProducts) => {
    let notification = {}
    for (let index = 0; index < oldProducts.length; index++) {
        if (oldProducts[index].notifications === undefined || oldProducts[index].notifications === null) {
            newProducts[index]["notifications"] = null
        } else {
            newProducts[index].notifications = oldProducts[index].notifications
        }
        if (oldProducts[index].price !== newProducts[index].price) {
            notification["oldPrice"] = oldProducts[index].price
            notification["newPrice"] = newProducts[index].price
            notification["date"] = Date()
            notification["id"] = uuidv4()
            if (newProducts[index].notifications === null) {
                newProducts[index]["notifications"] = [notification]
            } else {
                newProducts[index].notifications.push(notification)
            }
        }
    }
    return (newProducts)
}

const productsCtrl = {
    getProductsInfoFromUrl: async (req, res) => {
        try {
            let body = req.body
            if (body !== undefined) {
                if (body.data !== "") {
                    let productsData = await callUrlAndScrp(body.data)
                    res.send(productsData)
                } else {
                    res.status(400).send({ "error": "Empty url" })
                }
            } else {
                res.status(400).send({ "error": "Empty body" })
            }
        } catch (error) {
            res.status(500).send({ "error": error })
        }
    },
    refreshProductsList: async (req, res) => {
        try {
            let body = req.body
            if (body !== undefined) {
                let productsData = await callUrlAndScrp(body.data)
                let finalResult = checkPriceNotification(body.data, fakeResult)
                res.send(finalResult)
            } else {
                res.status(400).send({ "error": "Empty body" })
            }
        } catch (error) {
            res.status(500).send({ "error": error })
        }
    }
}

products.post('/extract', productsCtrl.getProductsInfoFromUrl);
products.post('/refresh', productsCtrl.refreshProductsList);

module.exports = products 