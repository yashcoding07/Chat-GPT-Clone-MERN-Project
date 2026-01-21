import axios from "../api/AxiosConfig";
import { setMessages } from "./MessageSlice";

export const sendMessage = (chatId, content, role = "user") => async () => {
    try {
        await axios.post("/message/send", { chatId, content, role }, {withCredentials: true});
    } catch (error) {
        console.log(error);
    }
};

export const getMessages = (chatId) => async (dispatch) => {
    try {
        const response = await axios.get(`/message/${chatId}`, {withCredentials: true});
        dispatch(setMessages(response.data));
    } catch (error) {
        console.log(error);
    }
};