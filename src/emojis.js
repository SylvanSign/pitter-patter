export const EMOJIS = {
  alien: '👽',
  human: '👨‍🚀',
  default: '❓',
}

export function roleToEmoji(role) {
  return EMOJIS[role] || EMOJIS.default
}
