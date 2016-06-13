import { combineReducers } from 'redux'
import * as types from '../constants/ActionTypes'

export function getQuantityInBasket (state) {
  return state.products
    .map(product => product.quantity)
    .reduce((prev, curr) => prev + curr, 0);
}

export function getProductsInBasket (state) {
  return state.products
    .filter(product => product.quantity > 0)
    .map(product => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      linePrice: product.linePrice
    }))
}

export function getSubTotal (state) {
  const subTotal = state.products
    .map(product => product.price.substring(1) * product.quantity)
    .reduce((prev, curr) => prev + curr, 0) || 0;
  return `£${subTotal.toFixed(2)}`
}

export function getDiscount (state) {
  const subTotal = getSubTotal(state).substring(1)
  const discount = state.discount ? (state.discount.amount / 100) : 0;
  return `£${(subTotal * discount).toFixed(2)}`;
}

export function getBasketTotal (state) {
  const subTotal = getSubTotal(state).substring(1);
  const discount = getDiscount(state).substring(1);
  return `£${(subTotal - discount).toFixed(2)}`;
}

export function isFetching (state = false, action) {
  switch (action.type) {
    case types.RECEIVE_PRODUCTS:
      return false;
    case types.REQUEST_PRODUCTS:
      return true;
    default:
      return state;
  }
}

export function products (state = [], action) {
  switch (action.type) {
    case types.RECEIVE_PRODUCTS:
      return action.payload.products
        .map(product => {
          let quantity = state
            .reduce((prev, curr, index, products) => (products[index].id === product.sku.toString()) ? products[index].quantity : prev, 0);
          if (quantity > 10) quantity = 10;
          const linePrice = quantity ? `£${(product.price * quantity).toFixed(2)}` : '£0.00';
          return {
            id: product.sku.toString(),
            name: product.name,
            price: `£${product.price.toFixed(2)}`,
            quantity,
            linePrice
          }});
    case types.ADD_TO_BASKET:
      return state.map(product => {
          let quantity = product.id === action.payload.id ? ++product.quantity : product.quantity;
          if (quantity > 10) quantity = 10;
          const linePrice = quantity ? `£${(product.price.substring(1) * quantity).toFixed(2)}` : '£0.00';
          return {
            ...product,
            quantity,
            linePrice
          }
        });
    case types.REMOVE_FROM_BASKET:
      return state.map(product => ({
          ...product,
          quantity: product.id === action.payload.id ? 0 : product.quantity,
          linePrice: product.id === action.payload.id ? `£0.00` : product.linePrice,
        }));
    case types.CHANGE_QUANTITY:
      return state.map(product => {
          let quantity = product.id === action.payload.id ? action.payload.quantity : product.quantity;
          if (quantity > 10) quantity = 10;
          const linePrice = quantity ? `£${(product.price.substring(1) * quantity).toFixed(2)}` : '£0.00';
          return {
            ...product,
            quantity,
            linePrice
          }
        });
    default:
      return state;
  }
}

export function promoCode (state = null, action) {
  if (action.type === types.RECEIVE_PROMO_CODE) {
    return action.payload.promoCode
  } else {
    return state;
  }
}

export function discount (state = null, action) {
  if (action.type === types.RECEIVE_DISCOUNT) {
    return action.payload.discount
  } else {
    return state;
  }
}
