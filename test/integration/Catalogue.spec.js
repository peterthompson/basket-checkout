import { assert } from 'chai'
import { mount } from 'enzyme'
import nock from 'nock'
import React from 'react'
import { Link } from 'react-router'
import { api } from '../../app/js/constants'
import configureStore from '../../app/js/configureStore'
import Catalogue from '../../app/js/components/Catalogue'

const timeout = (value = 10) => new Promise(resolve => setTimeout(resolve, value));

const product = { sku: 1, name: "Product One", description: "Product One description", price: 1.11 };

const mockGetAllProducts = () => {
  nock(api.baseUrl)
    .get(api.products)
    .reply(200, [product]);
}

const render = jsx => {
  const context = { store: configureStore() };
  const wrapper = mount(jsx, { context });

  return { catalogue: wrapper }
}

describe('Catalogue component integration', function() {

  beforeEach(() => {
    mockGetAllProducts();
  });

  it('should display the product catalogue', async () => {
    const { catalogue } = render(<Catalogue />);

    await timeout(); // used to pop async getAllProducts call off call stack

    assert(catalogue.text().includes(product.name), `did not find '${product.name}'`);
  });

  context(`when the user clicks 'Add to basket'`, () => {
    it('should add the product to the basket', async () => {
      const { catalogue } = render(<Catalogue />);

      await timeout(); // used to pop async getAllProducts call off call stack

      const basketLink = catalogue.findWhere(n => n.is(Link) && n.text().includes('Basket'));

      assert.equal(basketLink.text(), 'Basket 0', `basket should not contain any products initially`);

      const button = catalogue.findWhere(n => n.is('button') && n.text().includes('Add to basket'));

      button.simulate('click');

      await timeout();

      assert.equal(basketLink.text(), 'Basket 1', 'one product should have been added to the basket');
    });
  });
});
