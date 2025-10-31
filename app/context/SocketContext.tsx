"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

type SocketContextType = {
    socket: Socket | null
    connected: boolean
    connectSocket: () => Promise<void>
    disconnectSocket: () => void
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false,
    connectSocket: async () => { },
    disconnectSocket: () => { },
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [connected, setConnected] = useState(false)

    const connectSocket = async () => {
        if (socket && socket.connected) return
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string
        const s = io(serverUrl, { transports: ["websocket"], reconnection: true })
        setSocket(s)
            ; (window as any).__socket = s
        s.on("connect", () => setConnected(true))
        s.on("disconnect", () => setConnected(false))
    }

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect()
            setSocket(null)
            setConnected(false)
            delete (window as any).__socket
        }
    }

    useEffect(() => () => disconnectSocket(), [])

    return (
        <SocketContext.Provider value={{ socket, connected, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    )
}
