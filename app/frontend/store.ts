import { configureStore, Store, ThunkAction } from '@reduxjs/toolkit'
import { createWrapper, Context } from 'next-redux-wrapper';
// ...
import { cartSlice } from './slices/cart';
import { marketPlaceSlice } from './slices/products';


export const store = configureStore({
  reducer: {
    [cartSlice.name]: cartSlice.reducer,
    [marketPlaceSlice.name]: marketPlaceSlice.reducer,
  }
});


// Infer the `RootState` and `AppDispatch` types from the store itself
// export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<typeof store.getState>

// export const wrapper = createWrapper<AppStore>(store);
