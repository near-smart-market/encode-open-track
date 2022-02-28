import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { ProductDetails } from "../components/product_card";
import { HYDRATE } from "next-redux-wrapper";
import { getProduct } from "../utils/fakeData";
// Define a type for the slice state
interface MarketPlace {
  products: Array<ProductDetails>;
}

// Dummy Data
const prods = [];

for (let i = 0; i < 10; ++i) {
  prods.push(getProduct());
}

// Define the initial state using that type
const initialState: MarketPlace = {
  products: [...prods],
};

export const marketPlaceSlice = createSlice({
  name: "marketplace",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductDetails>) => {
      state.products = [...state.products, action.payload];
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      const deletedArray = state.products.filter(
        (product) => product.id !== action.payload
      );
      state.products = [...deletedArray];
    },
  },
//   extraReducers: {
//     [HYDRATE]: (state, action) => {
//       console.log("HYDRATE MKT:", action.payload);
//       return {
//         ...state,
//         ...action.payload.subject,
//       };
//     },
//   },
});

export const { addProduct, removeProduct } = marketPlaceSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getProducts = (state: RootState) => state?.[marketPlaceSlice.name].products;

export default marketPlaceSlice.reducer;
