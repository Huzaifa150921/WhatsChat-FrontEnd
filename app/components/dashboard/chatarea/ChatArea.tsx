"use client"


type User = { id: string; username: string; displayName: string }
type Message = { from: string; to: string; text: string; direction?: "inbound" | "outbound" }
type Thread = { user: string; messages: Message[] }
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaCheckDouble } from "react-icons/fa";


type Props = {
    selectedUser: string | null
    setSelectedUser: (user: string | null) => void
    users: User[]
    threads: Thread[]
    message: string
    handleMessage: (e: React.ChangeEvent<HTMLInputElement>) => void
    sendMessage: () => void
    scrollRef: React.RefObject<HTMLDivElement | null>
    currentUser: User | null
    Image: any
    onlineUsers: string[]
}

const ChatArea = ({
    selectedUser,
    setSelectedUser,
    users,
    threads,
    message,
    handleMessage,
    sendMessage,
    scrollRef,
    currentUser,
    Image,
    onlineUsers
}: Props) => {
    const messages = threads.find(t => t.user === selectedUser)?.messages || [];


    return (
        <div className={`${selectedUser ? "flex" : "hidden sm:flex"} flex-col flex-1 bg-dashboard-selecteduserBg`}>
            {selectedUser ? (

                <>

                    <div className="p-4 border-b border-dashboard-selecteduserBorder flex items-center gap-3">
                        <button onClick={() => setSelectedUser(null)} className="sm:hidden text-xl">←</button>

                        <img src={Image.src} alt={users.find(u => u.username === selectedUser)?.displayName || "Guest"} className="w-10 h-10 rounded-full" />

                        <div className="flex flex-col items-start justify-start">
                            <h2 className="font-semibold m-0 leading-tight">{users.find(u => u.username === selectedUser)?.displayName || selectedUser}</h2>
                            <p className="text-sm text-dashboard-onlinetext m-0 ">{onlineUsers.includes(selectedUser) ? "Online" : "Offline"}</p>
                        </div>
                    </div>


                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div className="relative" key={i}>

                                <div

                                    className={`max-w-xs md:max-w-sm p-3 rounded-lg ${msg.direction === "outbound" ? "bg-dashboard-senderBg ml-auto" : "bg-dashboard-reciverBg mr-auto"}`}
                                >
                                    {msg.text}
                                </div>
                                {
                                    msg.direction === "outbound" ?

                                        onlineUsers.includes(selectedUser) ?

                                            <FaCheckDouble className="absolute right-2 bottom-1" /> :
                                            <IoCheckmarkOutline className="absolute right-2 bottom-1" />
                                        : null

                                }
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-dashboard-msgBorder flex items-center space-x-3">
                        <input
                            value={message}
                            onChange={handleMessage}
                            type="text"
                            placeholder="Type a message"
                            className="flex-1 px-4 py-2 rounded-lg bg-dashboard-msgBg placeholder-dashboard-msgPlaceholder focus:outline-none focus:bg-dashboard-msgFocus"
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage} className="bg-dashboard-sendbuttonBg text-dashboard-sendbuttonText px-4 py-2 rounded-lg font-semibold hover:bg-dashboard-sendbuttonbgHover transition">Send ➤</button>
                    </div>
                </>
            ) : (
                <div className="hidden sm:flex flex-col items-center justify-center flex-1 text-dashboard-welcomeText space-y-2">
                    <h1 className="text-2xl font-semibold text-dashboard-welcomeHeading">Hi, {currentUser?.displayName} 👋</h1>
                    <p className="text-sm text-dashboard-welcomeBody">Select a chat to start messaging 💬</p>
                </div>
            )}
        </div>
    )
}

export default ChatArea