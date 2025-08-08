// // hooks/useCategoryMap.ts
// 'use client'

// import { useAppSelector } from "@/store/hooks"
// import { useMemo } from "react"

// export const useCategoryMap = (id?: string) => {
//   const { categoryData } = useAppSelector(state => state.categories)

//   const categoryMap = useMemo(() => {
//     const map: Record<string, string> = {}
//     categoryData.forEach(cat => {
//       map[cat.id] = cat.name
//     })
//     return map
//   }, [categoryData])

//   if (!id) return categoryMap

//   return categoryMap[id] || "Unknown"
// }
