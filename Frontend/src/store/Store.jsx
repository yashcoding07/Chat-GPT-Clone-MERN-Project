import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./MessageSlice";

const store = configureStore({
    reducer: {
        messages: messageReducer
    }
})

export default store;
