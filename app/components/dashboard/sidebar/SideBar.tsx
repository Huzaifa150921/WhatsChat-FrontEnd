"use client"
import React, { useEffect, useState } from "react"

type User = { id: string; username: string; displayName: string }

type Props = {
    selectedUser: string | null
    setSelectedUser: (username: string) => void
    handleLogout: () => void
    Image: any
    users: User[]
}

const Sidebar = ({ selectedUser, setSelectedUser, handleLogout, Image, users }: Props) => {
    const [visibleUsers, setVisibleUsers] = useState<User[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        const trimmed = search.trim()
        if (!trimmed) {
            setVisibleUsers(users)
            return
        }

        const timer = setTimeout(() => {
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/search?q=${encodeURIComponent(trimmed)}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(d => {
                    if (d.success) {
                        const exactMatches = d.users.filter((u: User) => u.username === trimmed)
                        setVisibleUsers(exactMatches)
                    }
                })
        }, 300)

        return () => clearTimeout(timer)
    }, [search, users])

    return (
        <div className={`${selectedUser ? "hidden sm:flex" : "flex"} w-full sm:w-1/3 md:w-1/4 border-r border-dashboard-sidebarBorder bg-dashboard-sidebarBg flex-col`}>
            <div className="flex items-center justify-between p-4 border-b border-dashboard-titlesectionBorder">
                <h2 className="text-lg font-semibold">WhatsChat</h2>
                <button onClick={handleLogout} className="text-sm bg-dashboard-titlesectionButton px-3 py-1 rounded-lg hover:bg-dashboard-titlesectionButtonHover transition">Logout</button>
            </div>

            <div className="p-3">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search username"
                    className="w-full px-4 py-2 rounded-lg bg-dashboard-searchinputBg placeholder-dashboard-searchinputPlaceholder focus:outline-none focus:bg-dashboard-searchinputFocus"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {visibleUsers.map(user => (
                    <div
                        key={user.id}
                        onClick={() => setSelectedUser(user.username)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-dashboard-userbgHover ${selectedUser === user.username ? "bg-dashboard-userBg" : ""}`}
                    >
                        <img src={Image.src} alt={user.displayName} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-sm text-dashboard-userTagline">@{user.username}</div>
                        </div>
                    </div>
                ))}
                {visibleUsers.length === 0 && <p className="text-center text-sm text-dashboard-userTagline mt-6">No users found</p>}
            </div>
        </div>
    )
}

export default Sidebar
