import axios from "../api/AxiosConfig";
import { setMessages, addMessage } from "./MessageSlice";

export const sendMessage = (chatId, content) => async (dispatch) => {
    try {
        const response = await axios.post("/message/send", { chatId, content });
        dispatch(addMessage(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const getMessages = (chatId) => async (dispatch) => {
    try {
        const response = await axios.get(`/message/${chatId}`);
        dispatch(setMessages(response.data));
    } catch (error) {
        console.log(error);
    }
};