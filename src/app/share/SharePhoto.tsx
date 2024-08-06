"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"

const SharePhoto = () => {
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/upload")
        setImages(response.data.images)
      } catch (err) {
        setError("Falla al cargar las imagenes.")
      }
    }

    fetchImages()
  }, [])

  return (
    <div>
      {error && <p className="text-red-700">{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.length === 0 ? (
          <p className="m-3">No hay imagenes cargadas.</p>
        ) : (
          images.map((image, index) => (
            <div key={index} className="m-3">
              <Image src={image} alt={`Image ${index}`} width={300} height={300} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SharePhoto
