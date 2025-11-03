"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "@/public/images/default_pic.jpg"
import { useSocket } from "@/app/context/SocketContext"
import ChatLoader from "@/app/components/uielements/loaders/chatloader/ChatLoader"
type User = {
    id: string
    username: string
    displayName: string
}

type Message = {
    from: string
    to: string
    text: string
    createdAt?: string
    direction?: "inbound" | "outbound"
}

type Thread = {
    user: string
    messages: Message[]
}

export default function ChatsPage() {
    const [search, setSearch] = useState("")
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [threads, setThreads] = useState<Thread[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(null)
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
                if (res.error) router.push("/login")
                else {
                    setCurrentUser(res.user)
                    activeSocket.emit("get_users", (resp: any) => {
                        if (resp.success) setUsers(resp.users)
                        setLoading(false)
                    })
                }
            })
        }

        if (activeSocket.connected) authenticateUser()
        else activeSocket.once("connect", authenticateUser)

        activeSocket.on("receive_message", (data: Message) => {
            const partner = data.from === currentUsername ? data.to : data.from
            setThreads(prev => {
                const idx = prev.findIndex(t => t.user === partner)
                const shaped: Message = {
                    ...data,
                    direction: data.from === currentUsername ? "outbound" : "inbound",
                }
                if (idx === -1) return [{ user: partner, messages: [shaped] }, ...prev]
                const copy = [...prev]
                copy[idx] = { user: partner, messages: [...copy[idx].messages, shaped] }
                return copy
            })
            if (!users.find(u => u.username === partner)) {
                activeSocket.emit("get_users", (resp: any) => {
                    if (resp.success) setUsers(resp.users)
                })
            }
        })

        return () => {
            activeSocket.off("receive_message")
            activeSocket.off("connect", authenticateUser)
        }
    }, [socket])

    useEffect(() => {
        if (!socket || !selectedUser) return
        socket.emit("get_messages", { username: selectedUser }, (res: any) => {
            if (res.success) {
                setThreads(prev => {
                    const idx = prev.findIndex(t => t.user === selectedUser)
                    const newThread = {
                        user: selectedUser,
                        messages: res.messages.map((m: any) => ({
                            ...m,
                            direction: m.from === username ? "outbound" : "inbound",
                        })),
                    }
                    if (idx === -1) return [newThread, ...prev]
                    const copy = [...prev]
                    copy[idx] = newThread
                    return copy
                })
            }
        })
    }, [selectedUser, socket])

    useEffect(() => {
        if (!socket || !search.trim()) {
            setSearchResults([])
            return
        }
        const timer = setTimeout(() => {
            socket.emit("search_users", search.trim(), (resp: any) => {
                if (resp.success) setSearchResults(resp.users)
            })
        }, 300)
        return () => clearTimeout(timer)
    }, [search, socket])

    const handleLogout = () => {
        disconnectSocket()
        localStorage.clear()
        router.push("/login")
    }

    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

    const sendMessage = () => {
        if (!message || !selectedUser || !socket) return
        socket.emit("send_message", { to: selectedUser, text: message }, (ack: any) => {
            if (ack && ack.success) setMessage("")
        })
    }


    const getMessagesFor = (user: string) => {
        const t = threads.find(tt => tt.user === user)
        return t ? t.messages : []
    }

    const visibleUsers = search ? searchResults : users

    if (loading) {
        return (
            <div className="h-screen w-full bg-dashboard-bg relative">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dashboard-loadingText">
                    <ChatLoader />
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex bg-dashboard-bg text-dashboard-text">
            <div
                className={`${selectedUser ? "hidden sm:flex" : "flex"
                    } w-full sm:w-1/3 md:w-1/4 border-r border-dashboard-sidebarBorder bg-dashboard-sidebarBg flex-col`}
            >
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search username"
                        className="w-full px-4 py-2 rounded-lg bg-dashboard-searchinputBg placeholder-dashboard-searchinputPlaceholder focus:outline-none focus:bg-dashboard-searchinputFocus"
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {visibleUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user.username)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-dashboard-userbgHover ${selectedUser === user.username ? "bg-dashboard-userBg" : ""
                                }`}
                        >
                            <img src={Image.src} alt={user.displayName} className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="font-medium">{user.displayName}</div>
                                <div className="text-sm text-dashboard-userTagline">{user.username}</div>
                            </div>
                        </div>
                    ))}
                    {visibleUsers.length === 0 && (
                        <p className="text-center text-sm text-dashboard-userTagline mt-6">No users found</p>
                    )}
                </div>
            </div>

            <div
                className={`${selectedUser ? "flex" : "hidden sm:flex"
                    } flex-col flex-1 bg-dashboard-selecteduserBg`}
            >
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-dashboard-selecteduserBorder flex items-center gap-3">
                            <button onClick={() => setSelectedUser(null)} className="sm:hidden text-xl">
                                ←
                            </button>
                            <img
                                src={Image.src}
                                alt={users.find(u => u.username === selectedUser)?.displayName || "Guest"}
                                className="w-10 h-10 rounded-full"
                            />
                            <h2 className="font-semibold">
                                {users.find(u => u.username === selectedUser)?.displayName || selectedUser}
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {getMessagesFor(selectedUser).map((msg, i) => (
                                <div
                                    key={i}
                                    className={`max-w-xs md:max-w-sm p-3 rounded-lg ${msg.direction === "outbound"
                                        ? "bg-dashboard-senderBg ml-auto"
                                        : "bg-dashboard-reciverBg mr-auto"
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
                            <button
                                onClick={sendMessage}
                                className="bg-dashboard-sendbuttonBg text-dashboard-sendbuttonText px-4 py-2 rounded-lg font-semibold hover:bg-dashboard-sendbuttonbgHover transition"
                            >
                                Send ➤
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="hidden sm:flex flex-col items-center justify-center flex-1 text-dashboard-welcomeText space-y-2">
                        <h1 className="text-2xl font-semibold text-dashboard-welcomeHeading">
                            Hi, {currentUser?.displayName} 👋
                        </h1>
                        <p className="text-sm text-dashboard-welcomeBody">Select a chat to start messaging 💬</p>
                    </div>
                )}
            </div>
        </div>
    )
}
