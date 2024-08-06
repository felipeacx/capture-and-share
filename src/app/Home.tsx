"use client"

import React, { useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
} from "firebase/auth"
import auth from "./data/authentication"
import { encryptData } from "./data/crypto"
import { useRouter } from "next/navigation"
import { handleFirebaseError, handleFirebaseLoginError } from "./data/firebaseErrors"

const Home = () => {
  const [register, setRegister] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [msg, setMsg] = useState<string>("")
  const provider = new GoogleAuthProvider()
  const router = useRouter()

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }
  function onRegister() {
    setRegister(true)
    setMsg("")
  }
  function onLogin() {
    setRegister(false)
    setMsg("")
  }
  async function signUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        const userInfo = { email: user.email }
        const infoCrypted = encryptData(userInfo)
        window.sessionStorage.setItem("info", infoCrypted)
        router.push("/share")
      })
      .catch((error) => {
        handleFirebaseError(error, setMsg)
      })
  }
  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        const userInfo = { email: user.email }
        const infoCrypted = encryptData(userInfo)
        window.sessionStorage.setItem("info", infoCrypted)
        router.push("/share")
      })
      .catch((error) => {
        handleFirebaseLoginError(error, setMsg)
      })
  }
  async function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential?.accessToken
        const user = result.user
        const userInfo = { email: user.email, token }
        const infoCrypted = encryptData(userInfo)
        window.sessionStorage.setItem("info", infoCrypted)
        router.push("/share")
      })
      .catch((_error) => {
        setMsg("Error iniciando sesión con Google")
      })
  }

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {register && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Register</h2>
            <form id="registerForm" className="space-y-4" onSubmit={signUp}>
              <div>
                <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="registerPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Registrarme
              </button>
            </form>
            <div className="my-6 text-center text-gray-500">O</div>
            <button
              id="googleSignIn"
              className="w-full bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onLogin}
            >
              Inicio de sesión
            </button>
          </>
        )}
        {!register && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800 text-center">Login</h2>
            <form id="loginForm" className="space-y-4" onSubmit={signIn}>
              <div>
                <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Iniciar sesión
              </button>
            </form>
            <div className="my-6 text-center text-gray-500">O</div>
            <button
              id="googleSignIn"
              className="w-full bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={signInWithGoogle}
            >
              Iniciar sesión con Google
            </button>
            <button
              id="googleSignIn"
              className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onRegister}
            >
              Registrarme
            </button>
          </>
        )}
        {msg && <p className="text-red-700 mt-3">{msg}</p>}
      </div>
    </div>
  )
}

export default Home
