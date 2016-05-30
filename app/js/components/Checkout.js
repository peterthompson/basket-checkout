import luhn from 'luhn'
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { routes } from '../constants'
import { changeQuantity, removeFromBasket, applyPromoCode, checkout } from '../actions'
import { getQuantityInBasket, getProductsInBasket, getSubTotal, getDiscount, getBasketTotal } from '../reducers'

export class Checkout extends Component {

  static propTypes = {
    quantityInBasket: PropTypes.number,
    productsInBasket: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      linePrice: PropTypes.string.isRequired
    })),
    changeQuantity: PropTypes.func,
    removeFromBasket: PropTypes.func,
    promoCode: PropTypes.string,
    applyPromoCode: PropTypes.func.isRequired,
    subTotal: PropTypes.string,
    discount: PropTypes.string,
    basketTotal: PropTypes.string,
    checkout: PropTypes.func.isRequired
  };

  render() {
    const {
      productsInBasket: products,
      changeQuantity,
      removeFromBasket,
      promoCode,
      applyPromoCode,
      subTotal,
      discount,
      basketTotal,
      checkout
    } = this.props;
    return (
      <div>
        <p>Checkout</p>
        <Link to={routes.Catalogue}>Continue shopping</Link>
        <Link to={routes.Checkout}>Basket</Link>
        <table>
          <caption className="hidden">The products in the basket</caption>
          <thead>
            <tr className="hidden">
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Line Price</th>
              <th>Product Actions</th>
            </tr>
          </thead>
          <tbody>
            {products && products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                  <select defaultValue={product.quantity} onChange={evt => changeQuantity(product.id, evt.target.value)}>
                  {[1,2,3,4,5,6,7,8,9,10].map(quantity => (
                      <option key={`${product.id}-${quantity}`} value={quantity}>{quantity}</option>
                  ))}
                  </select>
                </td>
                <td>{product.linePrice}</td>
                <td>
                  <button value={product.id} onClick={() => removeFromBasket(product.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={evt => { evt.preventDefault(); applyPromoCode(this.promoCode.value) }}>
          <label for="promo-code">Enter Promo Code</label>
          <input id="promo-code" type="text" defaultValue={promoCode} ref={n => { this.promoCode = n }} />
          <input type="submit" value="Apply" />
        </form>
        <table>
          <caption className="hidden">The basket summary</caption>
          <tbody>
            <tr>
              <th>Sub Total</th>
              <td>{subTotal}</td>
            </tr>
            <tr>
              <th>Promotional discount amount</th>
              <td>{discount}</td>
            </tr>
            <tr>
              <th>Basket Total</th>
              <td>{basketTotal}</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={evt => { evt.preventDefault(); luhn.validate(this.creditCard.value) && checkout(products, this.creditCard.value) }}>
          <label for="credit-card">Please enter your credit card number</label>
          <input id="credt-card" type="text" ref={n => { this.creditCard = n }} />
          <input type="submit" value="Checkout" disabled={!products.length}  />
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    quantityInBasket: getQuantityInBasket(state),
    productsInBasket: getProductsInBasket(state),
    promoCode: state.promoCode,
    subTotal: getSubTotal(state),
    discount: getDiscount(state),
    basketTotal: getBasketTotal(state),
  }
}

export default connect(
  mapStateToProps,
  { changeQuantity, removeFromBasket, applyPromoCode, checkout }
)(Checkout)
