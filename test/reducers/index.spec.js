import expect from 'expect'
import { getQuantityInBasket } from '../../app/js/reducers'
import * as types from '../../app/js/constants/ActionTypes'

describe('getQuantityInBasket reducer', () => {
  it('should return the quantity of products in the basket', () => {
    expect(
      getQuantityInBasket({
        products: [{ quantity: 0 }, { quantity: 1 }, { quantity: 2 }]
      })
    ).toEqual(3);
  });
});
