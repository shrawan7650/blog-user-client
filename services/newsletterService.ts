import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const newsletterService = {
  async subscribe({
    name,
    email,
    status = "active",   // default value
    subscribed = true,   // default value
  }: {
    name: string
    email: string
    status?: string
    subscribed?: boolean
  }) {
    try {
      await addDoc(collection(db, "newsletter"), {
        name,
        email,
        status,
        subscribed,
        subscribedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      throw error
    }
  },
}
