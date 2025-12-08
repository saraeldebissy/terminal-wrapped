/**
 * Command categorization
 */

import type { CommandEvent } from '../../history/models';
import { getBaseCommand } from '../../history/models';
import type { Category } from '../models';

interface CategoryDefinition {
  name: string;
  slug: string;
}

/**
 * Map of base commands to their categories
 */
const CATEGORY_MAP: Record<string, CategoryDefinition> = {
  // Version Control
  git: { name: 'Version Control', slug: 'vcs' },
  hg: { name: 'Version Control', slug: 'vcs' },
  svn: { name: 'Version Control', slug: 'vcs' },
  gh: { name: 'Version Control', slug: 'vcs' },

  // Package Management
  npm: { name: 'Package Management', slug: 'pkg' },
  yarn: { name: 'Package Management', slug: 'pkg' },
  pnpm: { name: 'Package Management', slug: 'pkg' },
  pip: { name: 'Package Management', slug: 'pkg' },
  pip3: { name: 'Package Management', slug: 'pkg' },
  cargo: { name: 'Package Management', slug: 'pkg' },
  brew: { name: 'Package Management', slug: 'pkg' },
  apt: { name: 'Package Management', slug: 'pkg' },
  'apt-get': { name: 'Package Management', slug: 'pkg' },
  yum: { name: 'Package Management', slug: 'pkg' },
  dnf: { name: 'Package Management', slug: 'pkg' },
  pacman: { name: 'Package Management', slug: 'pkg' },

  // Runtimes & Languages
  node: { name: 'Runtime', slug: 'runtime' },
  deno: { name: 'Runtime', slug: 'runtime' },
  bun: { name: 'Runtime', slug: 'runtime' },
  python: { name: 'Runtime', slug: 'runtime' },
  python3: { name: 'Runtime', slug: 'runtime' },
  ruby: { name: 'Runtime', slug: 'runtime' },
  go: { name: 'Runtime', slug: 'runtime' },
  java: { name: 'Runtime', slug: 'runtime' },
  rustc: { name: 'Runtime', slug: 'runtime' },

  // DevOps & Containers
  docker: { name: 'DevOps', slug: 'devops' },
  'docker-compose': { name: 'DevOps', slug: 'devops' },
  kubectl: { name: 'DevOps', slug: 'devops' },
  helm: { name: 'DevOps', slug: 'devops' },
  terraform: { name: 'DevOps', slug: 'devops' },
  ansible: { name: 'DevOps', slug: 'devops' },
  vagrant: { name: 'DevOps', slug: 'devops' },
  aws: { name: 'DevOps', slug: 'devops' },
  gcloud: { name: 'DevOps', slug: 'devops' },
  az: { name: 'DevOps', slug: 'devops' },

  // Remote Operations
  ssh: { name: 'Remote Ops', slug: 'remote' },
  scp: { name: 'Remote Ops', slug: 'remote' },
  rsync: { name: 'Remote Ops', slug: 'remote' },
  curl: { name: 'Remote Ops', slug: 'remote' },
  wget: { name: 'Remote Ops', slug: 'remote' },
  sftp: { name: 'Remote Ops', slug: 'remote' },

  // Editors
  vim: { name: 'Editors', slug: 'editor' },
  nvim: { name: 'Editors', slug: 'editor' },
  neovim: { name: 'Editors', slug: 'editor' },
  code: { name: 'Editors', slug: 'editor' },
  emacs: { name: 'Editors', slug: 'editor' },
  nano: { name: 'Editors', slug: 'editor' },
  subl: { name: 'Editors', slug: 'editor' },
  atom: { name: 'Editors', slug: 'editor' },

  // File Operations
  ls: { name: 'File Ops', slug: 'files' },
  ll: { name: 'File Ops', slug: 'files' },
  la: { name: 'File Ops', slug: 'files' },
  cd: { name: 'File Ops', slug: 'files' },
  mv: { name: 'File Ops', slug: 'files' },
  cp: { name: 'File Ops', slug: 'files' },
  rm: { name: 'File Ops', slug: 'files' },
  mkdir: { name: 'File Ops', slug: 'files' },
  rmdir: { name: 'File Ops', slug: 'files' },
  touch: { name: 'File Ops', slug: 'files' },
  cat: { name: 'File Ops', slug: 'files' },
  less: { name: 'File Ops', slug: 'files' },
  more: { name: 'File Ops', slug: 'files' },
  head: { name: 'File Ops', slug: 'files' },
  tail: { name: 'File Ops', slug: 'files' },
  find: { name: 'File Ops', slug: 'files' },
  grep: { name: 'File Ops', slug: 'files' },
  rg: { name: 'File Ops', slug: 'files' },
  ag: { name: 'File Ops', slug: 'files' },
  fd: { name: 'File Ops', slug: 'files' },
  fzf: { name: 'File Ops', slug: 'files' },

  // Shell & System
  echo: { name: 'Shell', slug: 'shell' },
  source: { name: 'Shell', slug: 'shell' },
  export: { name: 'Shell', slug: 'shell' },
  alias: { name: 'Shell', slug: 'shell' },
  env: { name: 'Shell', slug: 'shell' },
  which: { name: 'Shell', slug: 'shell' },
  history: { name: 'Shell', slug: 'shell' },
  man: { name: 'Shell', slug: 'shell' },
  ps: { name: 'Shell', slug: 'shell' },
  top: { name: 'Shell', slug: 'shell' },
  htop: { name: 'Shell', slug: 'shell' },
  kill: { name: 'Shell', slug: 'shell' },
  killall: { name: 'Shell', slug: 'shell' },
};

const MAX_EXAMPLES = 3;

/**
 * Aggregate commands into categories
 */
export function aggregateCategories(events: CommandEvent[]): Category[] {
  const categoryData = new Map<string, {
    def: CategoryDefinition;
    count: number;
    examples: Set<string>;
  }>();

  for (const event of events) {
    const baseCmd = getBaseCommand(event.command);
    const categoryDef = CATEGORY_MAP[baseCmd];

    if (!categoryDef) {
      continue;
    }

    const key = categoryDef.slug;

    if (!categoryData.has(key)) {
      categoryData.set(key, {
        def: categoryDef,
        count: 0,
        examples: new Set(),
      });
    }

    const data = categoryData.get(key)!;
    data.count++;

    if (data.examples.size < MAX_EXAMPLES) {
      data.examples.add(event.command);
    }
  }

  // Sort by count descending
  const sorted = [...categoryData.entries()]
    .sort((a, b) => b[1].count - a[1].count);

  return sorted.map(([, data]) => ({
    name: data.def.name,
    slug: data.def.slug,
    count: data.count,
    exampleCommands: [...data.examples],
  }));
}
