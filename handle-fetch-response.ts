export async function handleFetchResponse(res: Response) {
  if (res.ok) {
    return res.json()
  } else {
    if (res.status === 204) {
      return {}
    }
    const body = await res.json()
    console.error(body)
    throw new Error(res.statusText)
  }
}
