export const EMOJIS = {
  alien: '🐙',
  human: '👨‍🚀',
  dead: '💀',
  gone: '🚀',
  default: '❓',
}

export function roleToEmoji(role) {
  return EMOJIS[role] || EMOJIS.default
}
