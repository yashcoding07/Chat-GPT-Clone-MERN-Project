import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    activeChatId: null
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setActiveChatId: (state, action) => {
            state.activeChatId = action.payload;
            state.messages = []; // Clear messages when chat changes
        }
    }
});

export default messageSlice.reducer;
export const { setMessages, addMessage, setActiveChatId } = messageSlice.actions;
