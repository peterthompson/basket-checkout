import deepFreeze from 'deep-freeze'
import expect from 'expect'
import * as reducers from '../../app/js/reducers'
import * as types from '../../app/js/constants/ActionTypes'

const products = [
  {
    id: '1',
    name: 'Product One',
    price: '£1.11',
    quantity: 1,
    linePrice: '£1.11'
  },
  {
    id: '2',
    name: 'Product Two',
    price: '£2.22',
    quantity: 2,
    linePrice: '£4.44'
  },
  {
    id: '3',
    name: 'Product Three',
    price: '£3.33',
    quantity: 0,
    linePrice: '£0.00'
  }
];

const clone = arr => arr.map(obj => ({...obj})); // shallow copy an array of objects

describe('getQuantityInBasket reducer', () => {
  it('should return the quantity of products in the basket', () => {
    expect(
      reducers.getQuantityInBasket({
        products
      })
    ).toEqual(3);
  });
});

describe('getProductsInBasket', () => {
  it('should return products in the basket', () => {
    expect(
      reducers.getProductsInBasket({
        products
      })
    ).toEqual([
        { id: '1', name: 'Product One', quantity: 1, linePrice: '£1.11' },
        { id: '2', name: 'Product Two', quantity: 2, linePrice: '£4.44' }
    ]);
  });
});

describe('getSubTotal', () => {
  it('should return the basket sub total', () => {
    expect(
      reducers.getSubTotal({ products })
    ).toEqual('£5.55');
  });
});

describe('getDiscount', () => {
  it('should return the basket discount', () => {
    expect(
      reducers.getDiscount({
        products,
        discount: { amount: 10 }
      })
    ).toEqual('£0.56')
  })
});

describe('getBasketTotal', () => {
  it('should return the basket total', () => {
    expect(
      reducers.getBasketTotal({
        products,
        discount: { amount: 10 }
      })
    ).toEqual('£4.99')
  });
});

describe('products', () => {
  it('should handle initial state', () => {
    expect(
      reducers.products(undefined, {})
    ).toEqual([]);
  });

  it(`should handle action type ${types.RECEIVE_PRODUCTS}`, () => {
    const action = {
      type: types.RECEIVE_PRODUCTS,
      payload: { products: [
        {
          sku: 1,
          name: 'Product One',
          price: 1.11
        },
        {
          sku: 2,
          name: 'Product Two',
          price: 2.22
        },
        {
          sku: 3,
          name: 'Product Three',
          price: 3.33
        }
      ]}
    };
    expect(
      reducers.products(undefined, action)
    ).toEqual([
      {
        id: '1',
        name: 'Product One',
        price: '£1.11',
        quantity: 0,
        linePrice: '£0.00'
      },
      {
        id: '2',
        name: 'Product Two',
        price: '£2.22',
        quantity: 0,
        linePrice: '£0.00'
      },
      {
        id: '3',
        name: 'Product Three',
        price: '£3.33',
        quantity: 0,
        linePrice: '£0.00'
      }
    ])
  });

  it(`should handle action type ${types.ADD_TO_BASKET}`, () => {
    const action = { type: types.ADD_TO_BASKET, payload: { id: '1' } };
    let expectedProducts = clone(products)
    expectedProducts[0].quantity = 2;
    expectedProducts[0].linePrice = '£2.22';
    expect(
      reducers.products(products, action)
    ).toEqual(expectedProducts)
  });

  it(`should handle action type ${types.REMOVE_FROM_BASKET}`, () => {
    const action = { type: types.REMOVE_FROM_BASKET, payload: { id: '1' } };
    let expectedProducts = clone(products)
    expectedProducts[0].quantity = 0;
    expectedProducts[0].linePrice = '£0.00';
    expect(
      reducers.products(products, action)
    ).toEqual(expectedProducts)
  });

  it(`should handle action type ${types.CHANGE_QUANTITY}`, () => {
    const action = { type: types.CHANGE_QUANTITY, payload: { id: '1', quantity: 5 } };
    let expectedProducts = clone(products)
    expectedProducts[0].quantity = 5;
    expectedProducts[0].linePrice = '£5.55';
    expect(
      reducers.products(products, action)
    ).toEqual(expectedProducts)
  });

  it('should handle unknown action types', () => {
    const action = { type: 'UNKNOWN' };
    expect(
      reducers.products(undefined, action)
    ).toEqual([]);
  });
});

describe('promoCode', () => {
  it('should handle initial state', () => {
    expect(
      reducers.promoCode(undefined, {})
    ).toEqual(null);
  });

  it(`should handle action type ${types.RECEIVE_PROMO_CODE}`, () => {
    const promoCode = 'PROMO_CODE';
    const action = {
      type: types.RECEIVE_PROMO_CODE,
      payload: { promoCode }
    };
    expect(
      reducers.promoCode(undefined, action)
    ).toEqual(promoCode);
  });

  it('should handle unknown action types', () => {
    const action = { type: 'UNKNOWN' };
    expect(
      reducers.promoCode(undefined, action)
    ).toEqual(null);
  });
});

describe('discount', () => {
  it('should handle initial state', () => {
    expect(
      reducers.discount(undefined, {})
    ).toEqual(null);
  });

  it(`should handle action type ${types.RECEIVE_DISCOUNT}`, () => {
    const discount = 'DISCOUNT';
    const action = {
      type: types.RECEIVE_DISCOUNT,
      payload: { discount }
    };
    expect(
      reducers.discount(undefined, action)
    ).toEqual(discount);
  });

  it('should handle unknown action types', () => {
    const action = { type: 'UNKNOWN' };
    expect(
      reducers.discount(undefined, action)
    ).toEqual(null);
  });
});
