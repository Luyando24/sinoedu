/**
 * Maintenance mode CLI tool
 * Usage:
 *   npm run maintenance:enable   → locks the site (shows maintenance page)
 *   npm run maintenance:disable  → unlocks the site (normal operation)
 *   npm run maintenance:status   → prints current status without changing it
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('\n❌  NEXT_PUBLIC_SUPABASE_URL is not set in .env.local\n');
  process.exit(1);
}
if (!SERVICE_KEY) {
  console.error('\n❌  SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  console.error('   Add your Supabase service-role key to .env.local:\n');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  process.exit(1);
}

const BASE_URL = `${SUPABASE_URL}/rest/v1/site_settings`;
const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
};

async function getStatus(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}?key=eq.site_locked&select=value`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const data = (await res.json()) as Array<{ value: boolean }>;
  return data?.[0]?.value === true;
}

async function setLocked(locked: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}?key=eq.site_locked`, {
    method: 'PATCH',
    headers: { ...HEADERS, 'Prefer': 'return=representation' },
    body: JSON.stringify({ value: locked }),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status} ${res.statusText}`);
}

function printBanner(locked: boolean) {
  const GREEN  = '\x1b[32m';
  const RED    = '\x1b[31m';
  const YELLOW = '\x1b[33m';
  const BOLD   = '\x1b[1m';
  const RESET  = '\x1b[0m';

  const box = (lines: string[], color: string) => {
    const width = Math.max(...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length)) + 4;
    const border = '─'.repeat(width);
    console.log(`\n${color}┌${border}┐${RESET}`);
    for (const line of lines) {
      const rawLen = line.replace(/\x1b\[[0-9;]*m/g, '').length;
      const padding = ' '.repeat(width - rawLen - 2);
      console.log(`${color}│${RESET}  ${line}${padding}${color}│${RESET}`);
    }
    console.log(`${color}└${border}┘${RESET}\n`);
  };

  if (locked) {
    box([
      `${BOLD}${RED}🔒  Maintenance Mode: ENABLED${RESET}`,
      '',
      `${YELLOW}All public pages now redirect to the maintenance page.${RESET}`,
      `Run ${BOLD}npm run maintenance:disable${RESET}${YELLOW} to restore the site.${RESET}`,
    ], RED);
  } else {
    box([
      `${BOLD}${GREEN}✅  Maintenance Mode: DISABLED${RESET}`,
      '',
      `${GREEN}The website is live and accessible to everyone.${RESET}`,
      `Run ${BOLD}npm run maintenance:enable${RESET}${GREEN} to enable maintenance mode.${RESET}`,
    ], GREEN);
  }
}

async function main() {
  const command = process.argv[2]; // 'enable' | 'disable' | 'status'

  try {
    const current = await getStatus();

    if (command === 'enable') {
      if (current) {
        console.log('\n⚠️  Maintenance mode is already enabled.\n');
      } else {
        await setLocked(true);
        printBanner(true);
      }
    } else if (command === 'disable') {
      if (!current) {
        console.log('\n⚠️  Maintenance mode is already disabled.\n');
      } else {
        await setLocked(false);
        printBanner(false);
      }
    } else if (command === 'status') {
      printBanner(current);
    } else {
      console.error('\n❌  Invalid command. Use: enable | disable | status\n');
      process.exit(1);
    }
  } catch (err) {
    console.error('\n❌  Error:', (err as Error).message, '\n');
    process.exit(1);
  }
}

main();
