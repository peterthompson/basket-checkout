const utils = require("./../utils");

// only checks that a cardNumber is present in the submitted request body AND
// that it has a length of 16
// it does not perform a Luhn check on the submitted number
// (or check that the cardNumber is comprised of digits only)
function checkCardNumber(cardNumber) {
    if (typeof cardNumber !== "string") {
        return utils.createError("cardNumber", "You have not supplied a card number.");
    }

    if (cardNumber.length != 16) {
        return utils.createError("cardNumber", "You have not supplied a valid card number.");
    }

    if (/^5598208090357951$/.test(cardNumber) && Math.random() >= 0.5) {
        return utils.createError("cardNumber", "A random error has occurred");
    }

    if (/^4929718047638157$/.test(cardNumber)) {
        return utils.createError("cardNumber", "Card cannot be processed");
    }
}

// check that a basket
// exists
//
/**
 * check that a basket exists in the request body
 * is not empty
 * is an Array
 * the Array contains valid items containing sku and quantity properties. There is no validation that these properties
 * are numeric or that the values fall within accepted ranges.
 *
 * @param req
 * @param errors array to hold any error messages
 * @returns {boolean}
 */
function checkBasket(basket) {
    if (!basket) {
        return utils.createError("basket", "You have not sent a basket.");
    }
    if (!(basket instanceof Array)) {
        return utils.createError("basket", "Basket has to be an array");
    }
    if (basket.length === 0) {
        return utils.createError("basket", "Your basket is empty.");
    }

    for (var i = 0; i < basket.length; i++) {
        var item = basket[i];
        console.log("item sku = " + item.sku + " quantity = " + item.quantity);

        if (!item.sku || !item.quantity) {
            return utils.createError("basket", "One or more items in your basket is invalid. You must specify a sku and quantity.");
        }
    }
}

module.exports = function (req, res) {
    console.log("POST to /checkout");

    var body = JSON.parse(req.body);

    var errors = [];
    var basketError = checkBasket(body.basket);
    if (basketError) {
        errors.push(basketError);
    }
    var cardError = checkCardNumber(body.cardNumber);
    if (cardError) {
        errors.push(cardError);
    }

    if (errors.length === 0) {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
            msg: "The transaction was completed successfully."
        }));
    } else {
        utils.writeErrorResponse(res, errors);
    }
};
