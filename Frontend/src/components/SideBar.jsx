import { SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveChatId } from "../store/MessageSlice";
import axios from "../api/AxiosConfig";


const SideBar = () => {

    const dispatch = useDispatch();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get("/chat");
                setChats(response.data);
            } catch (error) {
                console.log("Error fetching chats", error);
            }
        }
        fetchChats();
    }, []);

    const createNewChat = () => {
        const title = prompt("Enter chat title");
        if (title) {
            setChats([...chats, { _id: Date.now().toString(), title }]);
        }
    }

    const handleChatClick = (id) => {
        dispatch(setActiveChatId(id));
    }

    return (
        <div className="sideBar h-screen w-72 bg-gray-800 p-3">
            <div className="flex items-center justify-between p-4">
                <img className="w-10 h-10 object-contain" src="https://img.icons8.com/nolan/2x/chatgpt.png" alt="ChatGPT" />
                <button className="hover:bg-gray-50/20 cursor-pointer active:scale-95 transition-all duration-200 p-2 rounded"><SlidersHorizontal color="white" /></button>
            </div>
            <div className="w-full flex flex-col gap-3 mt-5">
                <button onClick={createNewChat} className="hover:bg-neutral-50/20 cursor-pointer w-full flex items-start p-3 border border-gray-700 rounded active:scale-95 transition-all duration-200 text-white">+ New Chat</button>
                {chats.map((chat) => (
                    <div key={chat._id || chat.id} onClick={() => handleChatClick(chat._id || chat.id)} className="hover:bg-neutral-50/20 w-full flex items-start p-3 border border-gray-700 rounded transition-all duration-200 text-gray-300 cursor-pointer">{chat.title}</div>
                ))}
            </div>
        </div>
    )
}

export default SideBar