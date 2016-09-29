const utils = require("./../utils");

/**
 * Valid PromoCodes are X followed by one or two digits.
 * X0; X1; X50, X09 are valid
 * X; XXX; X123 etc. etc. are not
 *
 * @param req
 * @returns the matching single or double digits following the X
 */
function checkPromoCode(req) {
    var promoCode = JSON.parse(req.body).promoCode;

    console.log("promoCode received : " + promoCode);

    if (promoCode) {
        var match = promoCode.match(/^X([\d]{1,2})$/);
        if (match != null) {
            return parseInt(match[1], 10);
        }
    }
    return null;
}

module.exports = function (req, res) {
    var discount = checkPromoCode(req);

    if (Number.isFinite(discount)) {
        // it's a valid promo code
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
            discounttype: "percent",
            amount: discount
        }));
    } else {
        utils.writeErrorResponse(res, [
            utils.createError("promoCode", "The promo code you supplied is invalid.")
        ]);
    }
};
