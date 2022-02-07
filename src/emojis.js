export const EMOJIS = {
  alien: '🐙',
  human: '👨‍🚀',
  dead: '💀',
  pod: '🚀',
  fail: '🔥',
  success: '🌎',
  default: '❓',
}

export function roleToEmoji(role) {
  return EMOJIS[role] || EMOJIS.default
}
