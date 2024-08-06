"use client"

import React, { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [MenuOpen, SetMenuOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const [Notifications, SetNotifications] = useState<Notification[] | []>([])

  function goHome() {
    router.push("/")
  }
  function goShare() {
    router.push("/share")
  }

  return (
    <>
      <nav className="grid p-2 bg-primary-color h-auto sm:flex sm:justify-between sm:h-20">
        <div className="flex justify-between items-center gap-3">
          <button className="text-blue-700 font-bold text-xl" onClick={goHome}>
            Capturar
          </button>
          <button className="text-blue-700 font-bold text-xl" onClick={goShare}>
            Compartir
          </button>
        </div>
      </nav>
    </>
  )
}
