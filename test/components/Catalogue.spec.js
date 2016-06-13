import { assert } from 'chai'
import { shallow } from 'enzyme'
import React from 'react'
import { Link } from 'react-router'
import sinon from 'sinon'
import { routes } from '../../app/js/constants'
import { Catalogue } from '../../app/js/components/Catalogue'

const render = jsx => {
  const wrapper = shallow(jsx);
  const basketLink = wrapper.findWhere(n => n.is(Link) && n.contains('Basket'));
  const proceedToCheckoutLink = wrapper.findWhere(n => n.is(Link) && n.contains('Proceed to checkout'));
  const loading = wrapper.findWhere(n => n.is('p') && n.contains('loading…'));
  const productCatalogue = wrapper.find('table');
  const instance = wrapper.instance();
  return { basketLink, proceedToCheckoutLink, loading, productCatalogue, instance }
}

let props;

beforeEach(() => {
  props = {
    quantityInBasket: 1,
    productsInCatalogue: [
      {
        id: '1',
        name: 'Product One',
        price: '£1.11'
      },
      {
        id: '2',
        name: 'Product Two',
        price: '£2.22'
      }
    ],
    addToBasket: sinon.spy(),
    getAllProducts: sinon.spy()
  };
});

describe('Catalogue component', () => {
  it(`should render a 'Basket' link to the Checkout`, () => {
    const { basketLink } = render(<Catalogue {...props} />);
    assert.equal(basketLink.length, 1, `did not find a 'Basket' link, found ${basketLink.length}`);
    assert.equal(basketLink.prop('to'), routes.Checkout, `the 'Basket' link did not go to the Checkout`)
    assert(basketLink.contains(props.quantityInBasket), 'did not find quantity of products in the basket')
  });

  it('should render the product catalogue', () => {
    const { productCatalogue } = render(<Catalogue {...props} />);
    props.productsInCatalogue.forEach(product => {

      const row = productCatalogue.findWhere(n =>  n.is('tr') && n.contains(product.name));

      assert.equal(row.length, 1, `did not find row for '${product.name}'`);
      assert(row.contains(product.price), `did not find product price: ${product.price}`);

      const button = row.findWhere(n => n.is('button') && n.contains('Add to basket'));

      assert.equal(button.length, 1, `did not find 'Add to basket' button for ${product.name}`);

      button.simulate('click');

      assert(props.addToBasket.lastCall.calledWithExactly(product.id),
             `the 'Add to basket' button did not call the 'addToBasket' prop with product id: ${product.id}`);
    });
  });

  it(`should render a 'Proceed to checkout' link to the Checkout`, () => {
    const { proceedToCheckoutLink } = render(<Catalogue {...props} />);
    assert.equal(proceedToCheckoutLink.length, 1, `did not find a 'Proceed to checkout' link, found ${proceedToCheckoutLink.length}`);
    assert.equal(proceedToCheckoutLink.prop('to'), routes.Checkout, `the 'Proceed to checkout' link did not go to the Checkout`)
  });

  it(`should call 'getAllProducts' when it mounts`, () => {
    const { instance } = render(<Catalogue {...props} />);
    instance.componentDidMount();
    assert(props.getAllProducts.calledOnce, `the 'getAllProducts' prop was called`);
  });

  it(`should render a 'loading' notification when products are being fetched`, () => {
    const { loading } = render(<Catalogue {...props} isFetching={true} />);
    assert.equal(loading.length, 1, `did not find a 'loading' notification, found ${loading.length}`);
  });
})
