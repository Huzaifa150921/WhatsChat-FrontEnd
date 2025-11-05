"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Image from "@/public/images/default_pic.jpg"
import { useSocket } from "@/app/context/SocketContext"
import ChatArea from "@/app/components/dashboard/chatarea/ChatArea"
import Sidebar from "@/app/components/dashboard/sidebar/SideBar"
import Loader from "@/app/components/uielements/loaders/chatloader/ChatLoader"

type User = { id: string; username: string; displayName: string }
type Message = { from: string; to: string; text: string; direction?: "inbound" | "outbound" }
type Thread = { user: string; messages: Message[] }

export default function ChatsPage() {
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [users, setUsers] = useState<User[]>([])
    const [threads, setThreads] = useState<Thread[]>([])
    const [message, setMessage] = useState("")
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const { socket, connectSocket, disconnectSocket } = useSocket()
    const router = useRouter()
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const API = process.env.NEXT_PUBLIC_SERVER_URL

    useEffect(() => {
        const token = localStorage.getItem("token")
        const currentUsername = localStorage.getItem("username")
        if (!token || !currentUsername) {
            router.push("/login")
            return
        }
        setUsername(currentUsername)

        let activeSocket: any = null

        const setup = async () => {
            activeSocket = await connectSocket(token)
            if (!activeSocket) return

            activeSocket.emit("authenticate", { token }, (res: any) => {
                if (res.error) router.push("/login")
                else setCurrentUser(res.user)
            })

            activeSocket.on("receive_message", (data: Message) => {
                const partner = data.from === currentUsername ? data.to : data.from
                const shaped: Message = { ...data, direction: data.from === currentUsername ? "outbound" : "inbound" }

                setThreads(prev => {
                    const idx = prev.findIndex(t => t.user === partner)
                    if (idx === -1) return [{ user: partner, messages: [shaped] }, ...prev]
                    const copy = [...prev]
                    copy[idx] = { ...copy[idx], messages: [...copy[idx].messages, shaped] }
                    return copy
                })

                setUsers(u => {
                    if (!u.find(user => user.username === partner)) return [...u, { id: partner, username: partner, displayName: partner }]
                    return u
                })
            })

            fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => res.json())
                .then(data => {
                    if (data.success) setUsers(data.users)
                    setLoading(false)
                })
                .catch(() => setLoading(false))
        }

        setup()

        return () => {
            if (activeSocket) activeSocket.off("receive_message")
        }
    }, [])

    const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)

    const sendMessage = () => {
        if (!message || !selectedUser || !socket || !username) return

        const newMsg: Message = { from: username, to: selectedUser, text: message, direction: "outbound" }

        setThreads(prev => {
            const idx = prev.findIndex(t => t.user === selectedUser)
            if (idx === -1) return [{ user: selectedUser, messages: [newMsg] }, ...prev]
            const copy = [...prev]
            copy[idx] = { ...copy[idx], messages: [...copy[idx].messages, newMsg] }
            return copy
        })


        setUsers(u => {
            if (!u.find(user => user.username === selectedUser)) {
                return [...u, { id: selectedUser, username: selectedUser, displayName: selectedUser }]
            }
            return u
        })

        socket.emit("send_message", { to: selectedUser, text: message }, (ack: any) => {
            if (ack?.success) setMessage("")
        })
    }

    useEffect(() => {
        if (!selectedUser || threads.find(t => t.user === selectedUser)) return
        const token = localStorage.getItem("token")
        fetch(`${API}/messages/${selectedUser}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const msgs: Message[] = data.messages.map((m: any) => ({
                        ...m,
                        direction: m.from === username ? "outbound" : "inbound"
                    }))
                    setThreads(prev => [{ user: selectedUser, messages: msgs }, ...prev])
                }
            })
    }, [selectedUser, username, threads])

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [threads, selectedUser])

    const handleLogout = () => {
        disconnectSocket()
        localStorage.clear()
        router.push("/login")
    }

    if (loading) return (
        <div className="h-screen w-full bg-dashboard-bg relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dashboard-loadingText">
                <Loader />
            </div>
        </div>
    )

    return (
        <div className="h-screen flex bg-dashboard-bg text-dashboard-text">
            <Sidebar
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                users={users}
                handleLogout={handleLogout}
                Image={Image}
            />

            <ChatArea
                users={users}
                selectedUser={selectedUser}
                threads={threads}
                setSelectedUser={setSelectedUser}
                message={message}
                handleMessage={handleMessage}
                sendMessage={sendMessage}
                scrollRef={scrollRef}
                currentUser={currentUser}
                Image={Image}
            />
        </div>
    )
}
