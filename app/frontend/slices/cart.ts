import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { ProductDetails } from '../components/product_card';

import { getProduct } from "../utils/fakeData";
// Define a type for the slice state
interface CartState {
  products: Array<ProductDetails>
}

const prods = [];

for (let i = 0; i < 10; ++i) {
    prods.push(getProduct());
}
// Define the initial state using that type
const initialState: CartState = {
  products: [...prods]
}

export const cartSlice = createSlice({
  name: 'cart',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductDetails>) => {
      state.products = [
          ...state.products,
          action.payload
      ]
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      const deletedArray = state.products.filter((product) => (product.id !== action.payload))
      state.products = [...deletedArray]
    },
  }
})

export const { addProduct, removeProduct } = cartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getProducts = (state: RootState) => state.products.products

export default cartSlice.reducer