import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Menu, SendHorizontal } from "lucide-react";
import gsap from "gsap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { io } from "socket.io-client";

// Redux Actions
import { getMessages, sendMessage } from "../store/MessageAction";
import { setActiveChatId, addMessage } from "../store/MessageSlice";

// Components
import SideBar from "./SideBar";

const MainWindow = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const dispatch = useDispatch();
    const { messages, activeChatId } = useSelector((state) => state.messages);
    const { register, reset, handleSubmit } = useForm();
    const scrollRef = useRef(null);

    // 1. Socket Connection & AI Listener
    useEffect(() => {
        const tempSocket = io("https://chat-gpt-clone-mern-project.onrender.com", { withCredentials: true });

        tempSocket.on("ai-response", (data) => {
            const aiContent = typeof data === 'string' ? data : data.content;
            console.log("AI Message received:", aiContent);

            setIsTyping(false);

            // A. Update the UI via Redux immediately
            dispatch(addMessage({
                role: "model",
                content: aiContent
            }));

            // B. PERSISTENCE: Save AI message to DB
            // We must do this INSIDE the listener to have access to the message content
            if (activeChatId && activeChatId !== "temp-id") {
                dispatch(sendMessage(activeChatId, aiContent, "model"));
            }
        });

        setSocket(tempSocket);

        return () => {
            tempSocket.off("ai-response");
            tempSocket.disconnect();
        };
    }, [dispatch, activeChatId]); // Crucial: add activeChatId here so the listener has the current ID

    // 2. Fetch History when Chat ID changes
    useEffect(() => {
        if (activeChatId && activeChatId.length === 24 && activeChatId !== "temp-id") {
            dispatch(getMessages(activeChatId));
        }
    }, [activeChatId, dispatch]);

    // 3. Auto-scroll to bottom on new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // 4. GSAP Animation
    useLayoutEffect(() => {
        if (messages.length > 0) {
            gsap.fromTo(".chat-bubble-anim",
                { opacity: 0, y: 15, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [messages]);

    // 5. Form Submit Handler
    const messageHandler = (data) => {
        const content = data.content.trim();
        if (!content) return;

        // 1. Add user message to UI immediately
        dispatch(addMessage({ role: "user", content }));
        setIsTyping(true);

        // 2. Save user message to Database
        if (activeChatId && activeChatId !== "temp-id") {
            dispatch(sendMessage(activeChatId, content, "user"));
        } else {
            console.log("New chat - handle initialization logic here");
        }

        // 3. Emit via Socket
        if (socket) {
            socket.emit("ai-message", {
                chatId: activeChatId,
                content: content
            });
        }

        reset();
    };

    return (
        <div className="flex h-screen w-full bg-gray-950 text-gray-100 overflow-hidden font-sans">
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex flex-col flex-1 h-full relative">
                {/* MOBILE HEADER */}
                <header className="md:hidden flex items-center justify-between p-4 bg-gray-950 border-b border-gray-900">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-blue-400">Gemini Clone</span>
                    <div className="w-8" />
                </header>

                {/* MAIN CHAT AREA */}
                {/* The main container needs min-h-0 to prevent content from 'pushing' the layout */}
                <main className="flex-1 flex flex-col min-h-0 overflow-hidden">

                    {(!activeChatId || (messages.length === 0 && !isTyping)) ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6">
                            <h1 className="text-5xl md:text-7xl font-black text-center bg-gradient-to-br from-white via-blue-200 to-gray-600 bg-clip-text text-transparent opacity-20">
                                ChatGPT Clone
                            </h1>
                            <p className="mt-4 text-gray-500 font-medium text-center">How can I help you today?</p>
                        </div>
                    ) : (
                        /* This is the scrolling area */
                        <div className="flex-1 overflow-y-auto px-3 md:px-0 custom-scrollbar scroll-smooth">
                            <div className="w-full max-w-3xl mx-auto py-6 md:py-10 space-y-6 md:space-y-8">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`chat-bubble-anim
                            max-w-[92%] md:max-w-[80%] 
                            p-3 md:p-4 
                            rounded-2xl shadow-xl 
                            ${msg.role === 'user'
                                                ? "bg-blue-600 text-white rounded-br-none ml-2 md:ml-12"
                                                : "bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none mr-2 md:mr-12"
                                            }
                        `}>
                                            <div className="prose prose-invert prose-sm md:prose-base max-w-none break-words overflow-hidden">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start w-full">
                                        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl rounded-bl-none shadow-xl ml-2 md:ml-12">
                                            <div className="flex gap-1.5 items-center">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} className="h-4" />
                            </div>
                        </div>
                    )}
                </main>

                {/* INPUT AREA */}
                <div className="p-4 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent">
                    <form
                        onSubmit={handleSubmit(messageHandler)}
                        className="max-w-3xl mx-auto flex items-center gap-2 md:gap-3 bg-gray-900 p-1.5 md:p-2 rounded-2xl border border-gray-800 focus-within:border-blue-500/50 transition-all shadow-2xl"
                    >
                        <input
                            {...register("content", { required: true })}
                            className="flex-1 bg-transparent p-2 md:p-3 outline-none text-white placeholder-gray-500 text-sm md:text-base"
                            placeholder="Type your message..."
                            autoComplete="off"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(messageHandler)();
                                }
                            }}
                        />
                        <button type="submit" className="bg-blue-600 p-2.5 md:p-3 rounded-xl text-white hover:bg-blue-500 transition-all active:scale-90">
                            <SendHorizontal size={20} />
                        </button>
                    </form>
                    <p className="text-[10px] text-center mt-2 text-gray-600">
                        Chat-GPT Clone may provide inaccurate info. Check its responses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainWindow;