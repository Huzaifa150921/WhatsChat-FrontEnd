"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

type SocketContextType = {
    socket: Socket | null
    connected: boolean
    connectSocket: (token?: string) => Promise<Socket>
    disconnectSocket: () => void
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false,
    connectSocket: async () => { throw new Error("Socket not ready") },
    disconnectSocket: () => { },
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [connected, setConnected] = useState(false)

    const connectSocket = async (token?: string): Promise<Socket> => {
        return new Promise((resolve, reject) => {
            if (socket && socket.connected) return resolve(socket)

            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string
            const s = io(serverUrl, {
                transports: ["websocket"],
                reconnection: true,
                auth: token ? { token } : {},
            })
            setSocket(s)
                ; (window as any).__socket = s

            s.once("connect", () => {
                setConnected(true)
                resolve(s)
            })
            s.once("connect_error", reject)
            s.on("disconnect", () => setConnected(false))
        })
    }

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect()
            setSocket(null)
            setConnected(false)
            delete (window as any).__socket
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) connectSocket(token)
        return () => disconnectSocket()
    }, [])

    return (
        <SocketContext.Provider value={{ socket, connected, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    )
}
