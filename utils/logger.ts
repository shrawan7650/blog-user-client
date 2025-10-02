// // src/utils/logger.js

// // Simple log levels
// export const logInfo = (message, data) => {
//   if (process.env.NODE_ENV === "development") {
//     console.info(`[INFO] ${message}`, data || "")
//   } else {
//     console.log(`[INFO] ${message}`, data || "")
//   }
// }

// export const logWarn = (message, data) => {
//   if (process.env.NODE_ENV === "development") {
//     console.warn(`[WARN] ${message}`, data || "")
//   } else {
//     console.warn(`[WARN] ${message}`, data || "")
//   }
// }

// export const logError = (message, error) => {
//   if (process.env.NODE_ENV === "development") {
//     console.error(`[ERROR] ${message}`, error || "")
//   } else {
//     // For production — currently console.error
//     // Later you can replace with Sentry/LogRocket etc.
//     console.error(`[ERROR] ${message}`, error || "")
//   }
// }
