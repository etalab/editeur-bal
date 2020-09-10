export function formatDate(string) {
  const date = new Date(string)
  return date.toLocaleDateString()
}
