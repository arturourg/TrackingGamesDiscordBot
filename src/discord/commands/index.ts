import { helpCommand } from './system/help.command.js';
import { linkCommand } from './link/link.command.js';
import { unlinkCommand } from './link/unlink.command.js';
import { trophiesCommand } from './stats/trophies.command.js';
import { progressCommand } from './stats/progress.command.js';
import { playedCommand } from './stats/played.command.js';
import { backlogCommand } from './stats/backlog.command.js';
import { compareCommand } from './stats/compare.command.js';
import { syncCommand } from './sync/sync.command.js';

export const commandsRegistry = [
  helpCommand,
  linkCommand,
  unlinkCommand,
  trophiesCommand,
  progressCommand,
  playedCommand,
  backlogCommand,
  compareCommand,
  syncCommand
];
