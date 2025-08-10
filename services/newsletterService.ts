import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const newsletterService = {
  async subscribe(email: string) {
    try {
      await addDoc(collection(db, "newsletter"), {
        email,
        subscribedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      throw error
    }
  },
}
