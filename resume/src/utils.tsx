import { useQuery } from "react-query"

export const baseUrl = import.meta.env.PROD ?
  'https://goldfish-app-2-kbthc.ondigitalocean.app/api/'
  : 'http://localhost:3000/api/'

export const useData = (path, queryFn?) => {
  // console.log('use data')
  const defaultQueryFn = async () => {
    const url = baseUrl + path
    // console.log({ url })
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }
  return useQuery(path, queryFn || defaultQueryFn)
}