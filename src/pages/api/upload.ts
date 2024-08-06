import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"
import { IncomingForm } from "formidable"
import db from "@/app/data/firebase"
import { collection, doc, getDocs, setDoc } from "firebase/firestore"

export const config = {
  api: {
    bodyParser: false,
  },
}

export type ImageData = {
  url: string
  id?: string
  email?: string
  author?: string
  likes?: string[]
  dislikes?: string[]
}

type ResponseData = {
  message: string
  error?: string
  images?: ImageData[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === "GET") {
    try {
      const imagesDir = path.join(
        process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? "/tmp" : process.cwd(),
        "public",
        "uploads"
      )

      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true })
      }

      const files = fs.readdirSync(imagesDir)
      const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file))
      const imageUrls = imageFiles.map((file) => `/uploads/${file}`)

      const querySnapshot = await getDocs(collection(db, "favorites"))
      let photos: ImageData[] = []
      querySnapshot.forEach((doc) => {
        imageUrls.forEach((image) => {
          const internalId = image.split("/")[2]
          if (internalId === doc.data().id) {
            photos.push({
              ...doc.data(),
              url:
                process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD"
                  ? "/tmp/" + doc.data().id
                  : "/uploads/" + doc.data().id,
            })
          }
        })
      })
      res.status(200).json({ message: "Fotos cargadas", images: photos })
    } catch (error: any) {
      res.status(500).json({ message: "No se encontraron fotos", error: error.message })
    }
  } else if (req.method === "POST") {
    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Fallo al convertir los datos", error: err.message })
        return
      }

      const file = fields.file
      if (!file) {
        res.status(400).json({ message: "Foto no encontrada" })
        return
      }

      const email = fields.email
      if (!email) {
        res.status(400).json({ message: "Correo no encontrado" })
        return
      }

      try {
        const match = file.toString().match(/^data:image\/png;base64,/)
        if (!match) {
          res.status(400).json({ message: "Formato de foto no válido" })
          return
        }

        const base64Data = file.toString().replace(/^data:image\/png;base64,/, "")
        const saveDir = path.join(
          process.env.NEXT_PUBLIC_ENVIRONMENT === "PROD" ? "/tmp" : process.cwd(),
          "public",
          "uploads"
        )

        if (!fs.existsSync(saveDir)) {
          fs.mkdirSync(saveDir, { recursive: true })
        }

        const fileName = `image-${Date.now()}.png`
        const filePath = path.join(saveDir, fileName)
        const buffer = Buffer.from(base64Data, "base64")

        fs.writeFileSync(filePath, buffer)
        await setDoc(doc(db, "photos", fileName), {
          email: email[0],
          id: fileName,
        })

        const updateData: any = { id: fileName, author: email[0], likes: [], dislikes: [] }
        const favoriteRef = doc(db, "favorites", fileName)
        await setDoc(favoriteRef, updateData, { merge: true })
        res.status(200).json({ message: "Foto cargada" })
      } catch (error: any) {
        res.status(500).json({ message: "Carga fallida", error: error.message })
      }
    })
  } else {
    res.status(405).json({ message: "Método no permitido" })
  }
}
