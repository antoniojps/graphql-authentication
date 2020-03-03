export function setGoogleAvatarSize (avatarUrl, size) {
  if (!avatarUrl) return null
  const baseUrl = avatarUrl.split('?')[0]
  return baseUrl + `?sz=${size}`
}
