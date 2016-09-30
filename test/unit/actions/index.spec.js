import expect from 'expect'
import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../../app/js/actions'
import { api } from '../../../app/js/constants'
import * as types from '../../../app/js/constants/ActionTypes'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const productsInBasket = [
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
    quantity: 1,
    linePrice: '£2.22'
  }
];

const products = [
  {
    "sku": 1,
    "name": "Product One",
    "description": "Product One description",
    "price": 1.11
   },
   {
     "sku": 2,
     "name": "Product Two",
     "description": "Product Two description",
     "price": 2.22
   }
];

const creditCard = '000000000000000';

describe('requestProducts action creator', () => {
  it('should create an action to request products', () => {
    const expectedAction = {
      type: types.REQUEST_PRODUCTS
    };
    expect(actions.requestProducts(products)).toEqual(expectedAction);
  });
});

describe('receiveProducts action creator', () => {
  it('should create an action to receive products', () => {
    const expectedAction = {
      type: types.RECEIVE_PRODUCTS,
      payload: { products }
    };
    expect(actions.receiveProducts(products)).toEqual(expectedAction);
  });
});

describe('addToBasket action creator', () => {
  it('should create an action to add a product to the basket', () => {
    const id = '1';
    const expectedAction = {
      type: types.ADD_TO_BASKET,
      payload: { id }
    };
    expect(actions.addToBasket(id)).toEqual(expectedAction);
  });
});

describe('removeFromBasket action creator', () => {
  it('should create an action to remove a product to the basket', () => {
    const id = '1';
    const expectedAction = {
      type: types.REMOVE_FROM_BASKET,
      payload: { id }
    };
    expect(actions.removeFromBasket(id)).toEqual(expectedAction);
  });
});

describe('changeQuantity action creator', () => {
  it('should create an action to change the quantity of a product to the basket', () => {
    const id = '1';
    const quantity = 1;
    const expectedAction = {
      type: types.CHANGE_QUANTITY,
      payload: { id, quantity }
    };
    expect(actions.changeQuantity(id, quantity)).toEqual(expectedAction);
  });
});

describe('receivePromoCode action creator', () => {
  it('should create an action to add a promoCode', () => {
    const promoCode = 'PROMO_CODE';
    const expectedAction = {
      type: types.RECEIVE_PROMO_CODE,
      payload: { promoCode }
    };
    expect(actions.receivePromoCode(promoCode)).toEqual(expectedAction);
  });
});

describe('receiveDiscount action creator', () => {
  it('should create an action to add a discount', () => {
    const discount = 'DISCOUNT';
    const expectedAction = {
      type: types.RECEIVE_DISCOUNT,
      payload: { discount }
    };
    expect(actions.receiveDiscount(discount)).toEqual(expectedAction);
  });
});

describe('checkoutSuccess action creator', () => {
  it('should create an action to notify of a checkout success', () => {
    const expectedAction = {
      type: types.CHECKOUT_SUCCESS
    };
    expect(actions.checkoutSuccess()).toEqual(expectedAction);
  });
});

describe('checkoutFailure action creator', () => {
  it('should create an action to notify of a checkout failure', () => {
    const expectedAction = {
      type: types.CHECKOUT_FAILURE
    };
    expect(actions.checkoutFailure()).toEqual(expectedAction);
  });
});

describe('getAllProducts action creator', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it(`should create ${types.REQUEST_PRODUCTS} and ${types.RECEIVE_PRODUCTS}`, () => {

    nock(api.baseUrl)
      .get(api.products)
      .reply(200, products);

    const expectedActions = [
      { type: types.REQUEST_PRODUCTS },
      { type: types.RECEIVE_PRODUCTS, payload: { products }}
    ];
    const store = mockStore({ products: [] });

    return store.dispatch(actions.getAllProducts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  });
});

describe('applyPromoCode action creator', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it(`should create ${types.RECEIVE_PROMO_CODE} and ${types.RECEIVE_DISCOUNT}`, () => {

    const promoCode = 'X10';
    const discount = { discount: 'DISCOUNT' };

    nock(api.baseUrl)
      .post(api.promoCode)
      .reply(200, discount);

    const expectedActions = [
      { type: types.RECEIVE_PROMO_CODE, payload: { promoCode }},
      { type: types.RECEIVE_DISCOUNT, payload: { discount } }
    ];

    const store = mockStore({ products: [] });

    return store.dispatch(actions.applyPromoCode(promoCode))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  });
});

describe('checkout action creator', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  context('when the checkout fails', () => {

    it('should push the Failure route to the router', () => {
      nock(api.baseUrl)
        .post(api.checkout)
        .reply(500, { errors: [] })

      const payload = {
        args: [ 'failure' ],
        method: 'push'
      }
      const expectedActions = [
        { type: '@@router/CALL_HISTORY_METHOD', payload }
      ];

      const store = mockStore({ products: [] });

      return store.dispatch(actions.checkout(productsInBasket, creditCard))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    });
  });

  context('when the checkout succeeds', () => {
    it('should push the Success route to the router', () => {
      nock(api.baseUrl)
        .post(api.checkout)
        .reply(200, {})

      const payload = {
        args: [ 'success' ],
        method: 'push'
      }
      const expectedActions = [
        { type: '@@router/CALL_HISTORY_METHOD', payload }
      ];

      const store = mockStore({ products: [] });

      return store.dispatch(actions.checkout(productsInBasket, creditCard))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    });
  });
});
