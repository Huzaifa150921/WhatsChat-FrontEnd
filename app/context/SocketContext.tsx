"use client"
import React, { createContext, useContext, useState } from "react"
import { io, Socket } from "socket.io-client"

type SocketContextType = {
    socket: Socket | null
    connected: boolean
    connectSocket: (token: string) => Promise<Socket>
    disconnectSocket: () => void
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false,
    connectSocket: async () => { throw new Error("Socket not initialized") },
    disconnectSocket: () => { }
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [connected, setConnected] = useState(false)

    const connectSocket = async (token: string): Promise<Socket> => {
        return new Promise((resolve, reject) => {
            if (socket && socket.connected) return resolve(socket)

            if (!token) return reject(new Error("No token provided"))

            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string

            const s = io(serverUrl, {
                transports: ["websocket"],
                autoConnect: false,
                auth: { token }
            })

            s.connect()

            s.once("connect", () => {
                setConnected(true)
                setSocket(s)
                resolve(s)
            })

            s.once("connect_error", (err) => {
                s.disconnect()
                reject(err)
            })

            s.on("disconnect", () => setConnected(false))
        })
    }

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect()
            setSocket(null)
            setConnected(false)
        }
    }

    return (
        <SocketContext.Provider value={{ socket, connected, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    )
}
