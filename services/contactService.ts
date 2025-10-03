import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const contactService = {
  async submitContact(name: string, email: string, message: string) {
    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        submittedAt: serverTimestamp(),
      })
    } catch (error) {
      // console.error("Error submitting contact form:", error)
      throw error
    }
  },
}
