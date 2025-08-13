// utils/serializeData.ts
export function serializeData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Convert Firestore Timestamp
      if (
        value &&
        typeof value === "object" &&
        value.seconds !== undefined &&
        value.nanoseconds !== undefined
      ) {
        return new Date(value.seconds * 1000).toISOString();
      }
      return value;
    })
  );
}
