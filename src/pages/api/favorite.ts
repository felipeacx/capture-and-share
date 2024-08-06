import { NextApiRequest, NextApiResponse } from "next"
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import db from "@/app/data/firebase"

type ResponseData = {
  message: string
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === "POST") {
    const { action, id, email } = req.body

    const favoriteRef = doc(db, "favorites", id)
    const updateData: any = { id }

    if (action === "like") {
      updateData.likes = arrayUnion(email)
      updateData.dislikes = arrayRemove(email)
    } else if (action === "dislike") {
      updateData.dislikes = arrayUnion(email)
      updateData.likes = arrayRemove(email)
    }

    await setDoc(favoriteRef, updateData, { merge: true })

    res.status(200).json({ message: "Estado actualizado" })
  } else {
    res.status(405).json({ message: "Método no permitido" })
  }
}
