"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from '@/public/images/default_pic.jpg'
import { useSocket } from '@/app/context/SocketContext'
type User = {
    id: number;
    username: string
}

type Message = {
    from: string;
    to: string;
    text: string
}

export default function chatsPage() {
    const [search, setSearch] = useState("")
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Record<string, Message[]>>({})

    const { socket, disconnectSocket } = useSocket()
    const router = useRouter()


    useEffect(() => {
        const token = localStorage.getItem("token")
        const currentUsername = localStorage.getItem("username")

        if (!token || !currentUsername) {
            router.push("/login")
            return
        }

        setUsername(currentUsername)

        const activeSocket = socket ?? (window as any).__socket
        if (!activeSocket) return

        const authenticateUser = () => {
            activeSocket.emit("authenticate", { token }, (res: any) => {
                if (res.error) {
                    router.push("/login")
                } else {
                    activeSocket.emit("get_users", (resp: any) => {
                        if (resp.success) setUsers(resp.users)
                        setLoading(false)
                    })
                }
            })
        }

        if (activeSocket.connected) {
            authenticateUser()
        } else {
            activeSocket.once("connect", authenticateUser)
        }

        activeSocket.on("receive_message", (data: Message) => {
            const chatUser = data.from === currentUsername ? data.to : data.from
            setMessages(prev => ({
                ...prev,
                [chatUser]: [...(prev[chatUser] || []), data]
            }))
        })

        return () => {
            activeSocket.off("receive_message")
            activeSocket.off("connect", authenticateUser)
        }
    }, [socket])





    const handleLogout = () => {
        disconnectSocket();
        localStorage.clear();
        router.push("/login");
    }

    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const sendMessage = () => {
        if (!message || !selectedUser || !socket || !username) return
        const msg: Message = { from: username, to: selectedUser, text: message }
        socket.emit("send_message", msg)
        setMessage("")
    }

    if (loading) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dashboard-loadingText">
                Loading...
            </div>
        )
    }

    return (
        <div className="h-screen flex bg-dashboard-bg text-dashboard-text">
            <div className={`${selectedUser ? "hidden sm:flex" : "flex"} w-full sm:w-1/3 md:w-1/4 border-r border-dashboard-sidebarBorder bg-dashboard-sidebarBg flex-col`}>
                <div className="flex items-center justify-between p-4 border-b border-dashboard-titlesectionBorder">
                    <h2 className="text-lg font-semibold">WhatsChat</h2>
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-dashboard-titlesectionButton px-3 py-1 rounded-lg hover:bg-dashboard-titlesectionButtonHover transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="p-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search or start new chat"
                        className="w-full px-4 py-2 rounded-lg bg-dashboard-searchinputBg placeholder-dashboard-searchinputPlaceholder focus:outline-none focus:bg-dashboard-searchinputFocus"
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {users
                        .map((user) => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user.username)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-dashboard-userbgHover ${selectedUser === user.username ? "bg-dashboard-userBg" : ""}`}
                            >
                                <img src={Image.src} alt={user.username} className="w-10 h-10 rounded-full" />
                                <div>
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-sm text-dashboard-userTagline">Tap to chat</div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className={`${selectedUser ? "flex" : "hidden sm:flex"} flex-col flex-1 bg-dashboard-selecteduserBg`}>
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-dashboard-selecteduserBorder flex items-center gap-3">
                            <button onClick={() => setSelectedUser(null)} className="sm:hidden text-xl">←</button>
                            <img
                                src={Image.src}
                                alt={selectedUser}
                                className="w-10 h-10 rounded-full"
                            />
                            <h2 className="font-semibold">{selectedUser}</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {(messages[selectedUser] || []).map((msg, i) => (
                                <div
                                    key={i}
                                    className={`max-w-xs md:max-w-sm p-3 rounded-lg ${msg.from === username ? "bg-dashboard-senderBg ml-auto" : "bg-dashboard-reciverBg mr-auto"
                                        }`}
                                >
                                    {msg.text}
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
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button className="bg-dashboard-sendbuttonBg text-dashboard-sendbuttonText px-4 py-2 rounded-lg font-semibold hover:bg-dashboard-sendbuttonbgHover transition" onClick={sendMessage}>
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="hidden sm:flex flex-col items-center justify-center flex-1 text-dashboard-welcomeText space-y-2">
                        <h1 className="text-2xl font-semibold text-dashboard-welcomeHeading">Hi, {username} 👋</h1>
                        <p className="text-sm text-dashboard-welcomeBody">Select a chat to start messaging 💬</p>
                    </div>
                )}
            </div>
        </div>
    )
}
