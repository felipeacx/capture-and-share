import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"
import { IncomingForm } from "formidable"

export const config = {
  api: {
    bodyParser: false,
  },
}

type ResponseData = {
  message: string
  error?: string
  images?: string[]
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === "GET") {
    try {
      const imagesDir = path.join(process.cwd(), "public", "uploads")

      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true })
      }

      const files = fs.readdirSync(imagesDir)

      const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file))

      const imageUrls = imageFiles.map((file) => `/uploads/${file}`)

      res.status(200).json({ message: "Fotos cargadas", images: imageUrls })
    } catch (error: any) {
      res.status(500).json({ message: "No se encontraron fotos", error: error.message })
    }
  } else if (req.method === "POST") {
    const form = new IncomingForm()

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: "Fallo al convertir los datos", error: err.message })
        return
      }

      const file = fields.file
      if (!file) {
        res.status(400).json({ message: "Foto no encontrada" })
        return
      }

      try {
        const match = file.toString().match(/^data:image\/png;base64,/)
        if (!match) {
          res.status(400).json({ message: "Formato de foto no válido" })
          return
        }

        const base64Data = file.toString().replace(/^data:image\/png;base64,/, "")
        const saveDir = path.join(process.cwd(), "public", "uploads")

        if (!fs.existsSync(saveDir)) {
          fs.mkdirSync(saveDir, { recursive: true })
        }

        const filePath = path.join(saveDir, `image-${Date.now()}.png`)
        const buffer = Buffer.from(base64Data, "base64")

        fs.writeFileSync(filePath, buffer)

        res.status(200).json({ message: "Foto cargada" })
      } catch (error: any) {
        res.status(500).json({ message: "Carga fallida", error: error.message })
      }
    })
  } else {
    res.status(405).json({ message: "Método no permitido" })
  }
}
