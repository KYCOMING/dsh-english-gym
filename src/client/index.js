import { EnglishGymPill } from './shell/EnglishGymPill.js'
import { EnglishGymBoard } from './shell/EnglishGymBoard.js'

export const inject = ['slots']

export function apply(ctx) {
  ctx.slots.inject('conversation.composer.dock', () =>
    ctx.slots.register(
      { name: 'conversation.composer.dock', id: 'dsh-english-gym.pill', order: 20 },
      EnglishGymPill,
    ),
  )
  ctx.slots.inject('shell.overlay', () =>
    ctx.slots.register(
      { name: 'shell.overlay', id: 'dsh-english-gym.board', order: 20 },
      EnglishGymBoard,
    ),
  )
}
