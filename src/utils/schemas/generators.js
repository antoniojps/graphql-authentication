export function getDiscordAvatarFromProfile (profile) {
  if (!profile.avatar) return null
  const baseUrl = 'https://cdn.discordapp.com/'
  const format = '.png'
  const endpoint = `avatars/${profile.id}/${profile.avatar}`

  return baseUrl + endpoint + format
}

export function setGoogleAvatarSize (avatarUrl, size) {
  if (!avatarUrl) return null
  const baseUrl = avatarUrl.split('?')[0]
  return baseUrl + `?sz=${size}`
}
