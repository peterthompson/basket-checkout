import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { routes } from '../constants'
import { addToBasket, getAllProducts } from '../actions'
import { getQuantityInBasket } from '../reducers'

export class Catalogue extends Component {

  static propTypes = {
    quantityInBasket: PropTypes.number,
    productsInCatalogue: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired
    })),
    addToBasket: PropTypes.func,
    getAllProducts: PropTypes.func,
    isFetching: PropTypes.bool
  };

  componentDidMount() {
    this.props.getAllProducts();
  }

  render() {
    const { quantityInBasket, productsInCatalogue: products, addToBasket, isFetching } = this.props;
    return (
      <div>
        <h2>Catalogue</h2>
        <Link to={routes.Checkout}>
          Basket
          {' '}
          {quantityInBasket ? quantityInBasket : 0}
        </Link>
        {isFetching ? <p>loading&hellip;</p> :
        <table>
          <caption className="hidden">The products available to purchase.</caption>
					<tbody>
            <tr className="hidden">
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Product Actions</th>
            </tr>
            {products && products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <button value={product.id} onClick={() => addToBasket(product.id)}>Add to basket</button>
                </td>
              </tr>
            ))}
					</tbody>
        </table>
        }
        <Link to={routes.Checkout}>Proceed to checkout</Link>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
    quantityInBasket: getQuantityInBasket(state),
    productsInCatalogue: state.products,
    isFetching: state.isFetching
})

export default connect(
  mapStateToProps,
  { addToBasket, getAllProducts }
)(Catalogue)
