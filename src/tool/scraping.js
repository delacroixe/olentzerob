const cheerio = require("cheerio")

let getStringParentheses = (str) => {
    let regExp = /\(([^)]+)\)/
    var matches = regExp.exec(str)
    return matches[1]
}

let scrapMilanuncios = (data, url) => {
    const $ = cheerio.load(data, { decodeEntities: false })
    let loc = $(".pagAnuCatLoc").text()
    let seller = ''
    if ($(".pillSellerTypePro").text() !== '') {
        seller = $(".pillSellerTypePro").text()
    } else if ($(".pillSellerTypePriv").text() !== '') {
        seller = $(".pillSellerTypePriv").text()
    }
    let result = {
        "status": 0,
        "url": url,
        "title": $("h1.ad-detail-title").text(),
        "price": $(".pagAnuPrecioTexto").text().split(' ')[0],
        "location": getStringParentheses(loc),
        "seller": seller,
        "description": $(".pagAnuCuerpoAnu").text().substring(0, 200),
        "image": $(".pagAnuFoto").find('img').attr('src'),
        "cc": $(".cc").text().split(' ')[0],
        "year": $(".ano").text().split(' ')[1],
        "km": $(".kms").text().split(' ')[0],
        "notifications": null
    }
    //console.log("data " + JSON.stringify(result))
    return result
}

let scrapWallapop = (data, url) => {
    const $ = cheerio.load(data, { decodeEntities: false })
    let loc = $(".card-product-detail-location").find('a').text()
    let seller = $(".card-user-detail-name").find('span').text();
    let result = {
        "status": 0,
        "url": url,
        "title": $(".card-product-detail-title").text(),
        "price": $(".card-product-detail-price").text().split(' ')[0],
        "location": loc,
        "seller": seller,
        "description": $(".card-product-detail-description").text().substring(0, 200),
        "image": $(".card-slider-main ").find('img').attr('src'),
        "cc": '',
        "year": '',
        "km": '',
        "notifications": null
    }
    //console.log("data " + JSON.stringify(result))
    return result
}

const scrap = (response) => {
    if (response.config.url.includes("milanuncios.com/")) {
        return scrapMilanuncios(response.data, response.config.url)
    }
    if (response.config.url.includes("wallapop.com/")) {
        return scrapWallapop(response.data, response.config.url)
    }
}

module.exports = scrap