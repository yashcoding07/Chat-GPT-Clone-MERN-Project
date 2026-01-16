import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, getMessages } from "../store/MessageAction";
import { setActiveChatId, addMessage } from "../store/MessageSlice";
// import axios from "../api/AxiosConfig"; // Keep this if you need it for your implementation later

const MainWindow = () => {
    const dispatch = useDispatch();
    const { messages, activeChatId } = useSelector((state) => state.messages);
    const { register, reset, handleSubmit } = useForm();

    useEffect(() => {
        if (activeChatId && activeChatId.length === 24) {
            dispatch(getMessages(activeChatId));
        }
    }, [activeChatId, dispatch]);

    const messageHandler = (data) => {
        if (data.content) {
            // UI-Only Implementation:
            // 1. Create a temporary message object
            const newMessage = {
                role: "user",
                content: data.content
            };

            // 2. Dispatch action to update Redux store (optimistic UI update)
            // Note: This only updates the UI. You will need to implement the backend connection here.
            // If there's no active chat, set a dummy ID first to hide the placeholder
            // IMPORTANT: Do this BEFORE adding the message, because setActiveChatId clears the message list!
            if (!activeChatId) {
                dispatch(setActiveChatId("temp-id"));
            }

            // 2. Dispatch action to update Redux store (optimistic UI update)
            dispatch(addMessage(newMessage));

            // TODO: Implement Backend Connection
            // 1. Check if activeChatId exists. If not, create a new chat via API.
            // 2. Send the message content to the backend API.
            // 3. Dispatch global/thunk actions based on the response.

            reset();
        }
    }

    return (
        <div className="flex flex-col h-full w-full justify-between px-5">
            {(!activeChatId || messages.length === 0) ? (
                <div className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 text-center text-7xl font-bold flex items-center justify-center h-full">ChatGPT Clone</div>
            ) :
                <div className="w-full h-full mb-3 overflow-auto p-4 sm:p-10">
                    <div className="flex flex-col gap-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-2 rounded-xl text-white ${message.role === "user" ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none border border-gray-600"}`}>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
            <form onSubmit={handleSubmit(messageHandler)} className="flex mb-3 items-center justify-center gap-5">
                <input
                    {...register("content", { required: true })}
                    type="text"
                    placeholder="Ask a question..."
                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-750"
                />
                <button
                    className="w-fit px-5 py-3 cursor-pointer bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:shadow-none"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default MainWindow;