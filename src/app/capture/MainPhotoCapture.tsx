"use client"

import React, { useState, useRef } from "react"
import { useMediaDevices } from "react-use"
import axios from "axios"
import Image from "next/image"
import { decryptData } from "../data/crypto"

const PhotoCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [info, setInfo] = useState("")

  const devices = useMediaDevices()
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setInfo("")
      setImageSrc(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
    } catch (_err) {
      setInfo("Error accediendo a la camara")
    }
  }

  const takePhoto = () => {
    setInfo("")
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (context) {
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        setImageSrc(canvas.toDataURL("image/png"))
      }
    }
  }

  const uploadPhoto = async () => {
    if (imageSrc) {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", imageSrc)
        const userInfo = decryptData(window.sessionStorage.getItem("info"))
        formData.append("email", userInfo.email)
        const response = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        const result = response.data
        setInfo(result.message)
      } catch (err) {
        setInfo("Carga fallida")
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <div className="m-3">
      <h2 className="flex justify-center text-xl font-bold m-1">Capturar</h2>
      <div className="flex justify-center m-1">
        <video ref={videoRef} style={{ height: "50%" }}></video>
      </div>
      <div className="flex gap-3 m-1">
        <button className="border text-white bg-red-700 p-2 rounded-xl" onClick={startCamera}>
          Iniciar camara
        </button>
        <button className="border text-white bg-blue-700 p-2 rounded-xl" onClick={takePhoto}>
          Tomar foto
        </button>
      </div>
      {imageSrc && (
        <div className="m-1">
          <Image src={imageSrc} alt="Captured" width={400} height={300} />
          <button
            className="border text-white bg-red-700 p-2 rounded-xl m-1"
            onClick={uploadPhoto}
            disabled={uploading}
          >
            {uploading ? "Cargando..." : "Subir foto"}
          </button>
          {info && <p className="text-red-700">{info}</p>}
        </div>
      )}
    </div>
  )
}

export default PhotoCapture
