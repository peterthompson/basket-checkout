import { assert } from 'chai'
import { shallow, mount } from 'enzyme'
import React from 'react'
import { Link } from 'react-router'
import sinon from 'sinon'
import { routes } from '../../../app/js/constants'
import { Checkout } from '../../../app/js/components/Checkout'

const render = jsx => {
  const wrapper = shallow(jsx);
  const basketLink = wrapper.findWhere(n => n.is(Link) && n.contains('Basket'));
  const continueShoppingLink = wrapper.findWhere(n => n.is(Link) && n.contains('Continue shopping'));
  const productsInBasket = wrapper.find('table').first();
  const basketSummary = wrapper.find('table').last();
  return { basketLink, continueShoppingLink, productsInBasket, basketSummary }
}

let props;

beforeEach(() => {
  props = {
    productsInBasket: [
      {
        id: '1',
        name: 'Product One',
        quantity: 1,
        linePrice: '£1.11'
      },
      {
        id: '2',
        name: 'Product Two',
        quantity: 2,
        linePrice: '£4.44'
      }
    ],
    changeQuantity: sinon.spy(),
    removeFromBasket: sinon.spy(),
    applyPromoCode: sinon.spy(),
    subTotal: '£5.55',
    discount: '£0.56',
    basketTotal: '£4.99',
    checkout: sinon.spy()
  };
});

describe('Checkout component', () => {
  it('should render a paragraph', () => {
    const wrapper = shallow(<Checkout {...props} />);
    const p = wrapper.find('p');
    assert.equal(p.length, 1, `did not find a paragraph, found ${p.length}`)
  });

  it(`should render a 'Basket' link to the Checkout`, () => {
    const { basketLink } = render(<Checkout {...props} />);
    assert.equal(basketLink.length, 1, `did not find a 'Basket' link, found ${basketLink.length}`);
    assert.equal(basketLink.prop('to'), routes.Checkout, `the 'Basket' link did not go to the Checkout`)
  });

  it(`should render a 'Continue shopping' link to the Catalogue`, () => {
    const { continueShoppingLink } = render(<Checkout {...props} />);
    assert.equal(continueShoppingLink.length, 1, `did not find a 'Continue shopping' link, found ${continueShoppingLink.length}`);
    assert.equal(continueShoppingLink.prop('to'), routes.Catalogue, `the 'Continue shopping' link did not go to the Catalogue`)
  });

  it('should render the products in the basket', () => {
    const { productsInBasket } = render(<Checkout {...props} />);
    props.productsInBasket.forEach(product => {

      const row = productsInBasket.findWhere(n => n.is('tr') && n.contains(product.name));

      assert.equal(row.length, 1, `did not find row for '${product.name}'`);
      assert(row.contains(product.linePrice), `did not find product line price: ${product.linePrice}`);

      const select = row.find('select');
      const quantity = 2;

      assert.equal(select.length, 1, `did not find select control to change quantity for ${product.name}`);

      select.simulate('change', {target: { value: quantity }});

      assert(props.changeQuantity.lastCall.calledWithExactly(product.id, quantity),
             `the select control to change quantity did not call the 'changeQuantity' prop with product id: ${product.id} and quantity: ${quantity}`)

      const button = row.findWhere(n => n.is('button') && n.contains('Remove'));

      assert.equal(button.length, 1, `did not find 'Remove' button for ${product.name}`);

      button.simulate('click');

      assert(props.removeFromBasket.lastCall.calledWithExactly(product.id),
             `the 'Remove' button did not call the 'removeFromBasket' prop with product id: ${product.id}`);
    });
  });

  it(`should render the 'Enter Promo Code' form`, () => {
    // compount must be mounted to test node references, currently unsupported by shallow rendering
    const renderedComponent = mount(<Checkout {...props} />);
    const enterPromoCode = renderedComponent.find('form').first();
    assert.equal(enterPromoCode.length, 1, `did not find the 'Enter Promo Code' form`);

    const label = enterPromoCode.find('label');
    assert.equal(label.length, 1, `did not find 'Enter Promo Code' label`);

    const input = enterPromoCode.find('[type="text"]');
    assert.equal(input.length, 1, `did not find the 'Enter Promo Code' text input`);

    const apply = enterPromoCode.find('[type="submit"]');
    assert.equal(apply.length, 1, `did not find the 'Apply' button`);

    const promoCode = 'X10';
    renderedComponent.instance().promoCode.value = promoCode; // not ideal
    enterPromoCode.simulate('submit');

    assert(props.applyPromoCode.lastCall.calledWithExactly(promoCode),
           `submitting the form button did not call the 'applyPromoCode' prop with promo code: ${promoCode}`);
  });

  it('should render the basket summary', () => {
    const { subTotal, discount, basketTotal } = props;
    const { basketSummary } = render(<Checkout {...props} />);
    assert.equal(basketSummary.length, 1, 'did not find the basket summary');

    const subTotalRow = basketSummary.findWhere(n => n.is('tr') && n.contains('Sub Total'));
    assert.equal(subTotalRow.length, 1, `did not find the basket 'Sub Total' row`);
    assert(subTotalRow.contains(subTotal), `did not the basket 'Sub Total' of ${subTotal}`);

    const discountRow = basketSummary.findWhere(n => n.is('tr') && n.contains('Promotional discount amount'));
    assert.equal(discountRow.length, 1, `did not find the 'Promotional discount amount' row`);
    assert(discountRow.contains(discount), `did not find the 'Promotional Discount amount' of ${discount}`);

    const basketTotalRow = basketSummary.findWhere(n => n.is('tr') && n.contains('Basket Total'));
    assert.equal(basketTotalRow.length, 1, `did not find the 'Basket Total' row`);
    assert(basketTotalRow.contains(basketTotal), `did not find the 'Basket Total' of ${basketTotal}`);
  });

  it(`should render the credit card form`, () => {
    // compount must be mounted to test node references, currently unsupported by shallow rendering
    const renderedComponent = mount(<Checkout {...props} />);
    const creditCardForm = renderedComponent.find('form').last();
    assert.equal(creditCardForm.length, 1, `did not find the credit card form`);

    const label = creditCardForm.find('label');
    assert.equal(label.length, 1, `did not find 'Please enter your credit card number' label`);

    const input = creditCardForm.find('[type="text"]');
    assert.equal(input.length, 1, `did not find the credit card text input`);

    const checkout = creditCardForm.find('[type="submit"]');
    assert.equal(checkout.length, 1, `did not find the 'Checkout' button`);

    const creditCard = '4539456463019519';
    renderedComponent.instance().creditCard.value = creditCard; // not ideal
    creditCardForm.simulate('submit');

    assert(props.checkout.lastCall.calledWithExactly(props.productsInBasket, creditCard),
            `submitting the form button did not call the 'checkout' prop with the products in the basket and credit card number: ${creditCard}`);
  })
})
