"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()

  function goHome() {
    router.push("/")
  }
  function goCapture() {
    router.push("/capture")
  }
  function goShare() {
    router.push("/share")
  }
  function logout() {
    window.sessionStorage.removeItem("info")
    router.push("/")
  }

  return (
    <>
      <nav className="grid p-2 bg-primary-color h-auto sm:flex sm:justify-between sm:h-20">
        <div className="flex justify-between items-center gap-5">
          {pathname === "/" && (
            <button className="text-blue-700 font-bold text-xl" onClick={goHome}>
              Inicio
            </button>
          )}
          {pathname !== "/" && (
            <button className="text-blue-700 font-bold text-xl" onClick={goCapture}>
              Capturar
            </button>
          )}
          {pathname !== "/" && (
            <button className="text-blue-700 font-bold text-xl" onClick={goShare}>
              Compartir
            </button>
          )}
        </div>
        {pathname !== "/" && (
          <div>
            <button className="text-red-700 font-bold text-xl" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>
    </>
  )
}
