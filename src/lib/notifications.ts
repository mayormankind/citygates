import { collection, addDoc } from "firebase/firestore"
import { db } from "./firebaseConfig"

export interface CreateNotificationData {
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  userId?: string // Optional: for user-specific notifications
  slug?: string // Optional: for school-specific notifications 
}

export const createNotification = async (data: CreateNotificationData,slug:string) => {
  try {
    await addDoc(collection(db, "schools", slug,"notifications"), {
      ...data,
      read: false,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error("Error creating notification:", error)
  }
}

// Helper functions for common notifications
export const notifyStudentAdded = (studentName: string, slug: string) => {
  return createNotification({
    title: "New Student Enrolled",
    message: `${studentName} has been successfully enrolled in the system.`,
    type: "success",
  }, slug)
}

export const notifyClassCreated = (className: string, slug: string) => {
  return createNotification({
    title: "New Class Created",
    message: `${className} has been created and is ready for student enrollment.`,
    type: "info",
  }, slug)
}

export const notifyTeacherAdded = (teacherName: string, slug: string) => {
  return createNotification({
    title: "New Teacher Added",
    message: `${teacherName} has been added to the teaching staff.`,
    type: "success",
  },slug)
}
