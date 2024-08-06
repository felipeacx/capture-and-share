"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { ImageData } from "@/pages/api/upload"
import { FcDislike } from "react-icons/fc"
import { FcLike } from "react-icons/fc"
import { decryptData } from "../data/crypto"

const SharePhoto = () => {
  const [images, setImages] = useState<ImageData[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchImages = async () => {
    try {
      const response = await axios.get("/api/upload")
      setImages(response.data.images)
    } catch (err) {
      setError("Falla al cargar las imagenes.")
    }
  }
  useEffect(() => {
    fetchImages()
  }, [])

  const likePhoto = async (id: string) => {
    setError("")
    try {
      const userInfo = decryptData(window.sessionStorage.getItem("info"))
      const response = await axios.post("/api/favorite", {
        action: "like",
        id,
        email: userInfo.email,
      })
      const result = response.data
      setError(result.message)
      fetchImages()
    } catch (err) {
      setError("Carga fallida")
    }
  }

  const dislikePhoto = async (id: string) => {
    setError("")
    try {
      const userInfo = decryptData(window.sessionStorage.getItem("info"))
      const response = await axios.post("/api/favorite", {
        action: "dislike",
        id,
        email: userInfo.email,
      })
      const result = response.data
      setError(result.message)
      fetchImages()
    } catch (err) {
      setError("Carga fallida")
    }
  }

  return (
    <div>
      {error && <p className="ml-3 text-blue-700">{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.length === 0 ? (
          <p className="m-3">No hay imagenes cargadas.</p>
        ) : (
          images.map((image: ImageData, index) => (
            <div key={index} className="m-3">
              <img src={image.url} alt={`Image ${index}`} className="w-[300px] h-[300]" />
              <div className="flex justify-between items-center">
                <span className="text-sm">{image.author}</span>
                <div className="flex gap-5">
                  <div className="flex">
                    <FcLike
                      className="text-2xl hover:opacity-50 cursor-pointer"
                      onClick={() => likePhoto(image.id!)}
                    />
                    <span>{image.likes!.length}</span>
                  </div>
                  <div className="flex">
                    <FcDislike
                      className="text-2xl hover:opacity-50 cursor-pointer"
                      onClick={() => dislikePhoto(image.id!)}
                    />
                    <span>{image.dislikes!.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SharePhoto
