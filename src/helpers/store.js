import {createContext} from 'react';


export const GlobalStore = createContext()

export const GlobalStoreProvider = GlobalStore.Provider;

export const RestaurantStore = createContext({})

export const RestaurantProvider = RestaurantStore.Provider;


export default GlobalStore;