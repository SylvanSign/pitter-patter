export const EMOJIS = {
  alien: '🐙',
  human: '👨‍🚀',
  dead: '💀',
  gone: '🚀',
  fail: '🔥',
  success: '🌎',
  default: '❓',
}

export function roleToEmoji(role) {
  return EMOJIS[role] || EMOJIS.default
}
