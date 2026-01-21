import { SlidersHorizontal, X } from "lucide-react";
import { useState, useLayoutEffect, useRef, forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // 1. Import Redux hooks
import { io } from "socket.io-client";
import gsap from "gsap";
import axios from "../api/AxiosConfig";
import { setActiveChatId } from "../store/MessageSlice"; // 2. Import your action

const SideBar = forwardRef(({ isOpen, setIsOpen }, ref) => {
    const dispatch = useDispatch();
    const [chats, setChats] = useState([]);
    const sidebarRef = useRef(null);
    
    // 3. Get the current active ID to highlight the selected chat
    const { activeChatId } = useSelector((state) => state.messages);

    useLayoutEffect(() => {
        if (window.innerWidth < 768) {
            if (isOpen) {
                gsap.to(sidebarRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
            } else {
                gsap.to(sidebarRef.current, { x: "-100%", duration: 0.3, ease: "power2.in" });
            }
        }
    }, [isOpen]);

    // 4. Function to handle selection
    const handleSelectChat = (id) => {
        dispatch(setActiveChatId(id));
        if (window.innerWidth < 768) setIsOpen(false); // Auto-close sidebar on mobile
    };

    const createNewChat = async () => {
        let title = prompt("Enter chat title: ");
        if(title) title = title.trim();
        if(!title){
            alert("chat title cannot be empty");
            return;
        } 
        try {
            const response = await axios.post("/chat", {title}, {withCredentials: true});
            const newChat = { id: response.data.chat._id, title: response.data.chat.title };
            setChats([newChat, ...chats]);
            
            // 5. Automatically select the newly created chat
            handleSelectChat(newChat.id);
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    useEffect(() => {
        axios.get("/chat", {withCredentials: true})
        .then((response) => {
            const formattedChats = response.data.map(c => ({
                id: c._id,
                title: c.title
            }));
            setChats(formattedChats);
        })
        
    }, []);

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setIsOpen(false)}
                />
            )}
            
            <div 
                ref={sidebarRef}
                className={`fixed md:relative z-50 h-screen w-72 bg-gray-900 border-r border-gray-800 p-3 transform -translate-x-full md:translate-x-0 transition-none`}
            >
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <img className="w-8 h-8 object-contain" src="https://img.icons8.com/nolan/2x/chatgpt.png" alt="Logo" />
                        <span className="text-white font-bold">ChatGPT</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="w-full flex flex-col gap-3 mt-5 overflow-y-auto h-[calc(100vh-120px)]">
                    <button 
                        onClick={createNewChat} 
                        className="hover:bg-blue-600/20 w-full flex items-start p-3 border border-gray-700 rounded-xl transition-all text-white bg-gray-800/50"
                    > 
                        + New Chat
                    </button>
                    
                    {chats.map((chat) => (
                        <div 
                            key={chat.id} 
                            onClick={() => handleSelectChat(chat.id)} // 6. Trigger selection on click
                            className={`w-full p-3 rounded-xl transition-all cursor-pointer border truncate ${
                                activeChatId === chat.id 
                                ? "bg-gray-700 border-gray-500 text-white shadow-inner" // Active style
                                : "text-gray-300 border-transparent hover:bg-gray-800 hover:border-gray-700" // Inactive style
                            }`}
                        >
                            {chat.title}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
});

export default SideBar;