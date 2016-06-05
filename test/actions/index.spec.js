import expect from 'expect'
import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../app/js/actions'
import { api } from '../../app/js/constants'
import * as types from '../../app/js/constants/ActionTypes'

// TODO: complete tests, below are examples
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

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

describe('getAllProducts action creator', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it(`should create ${types.RECEIVE_PRODUCTS} when it receives products`, () => {

    nock(api.baseUrl)
      .get(api.products)
      .reply(200, products);

    const expectedActions = [{ type: types.RECEIVE_PRODUCTS, payload: { products }}];
    const store = mockStore({ products: [] });

    return store.dispatch(actions.getAllProducts())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  });
});
