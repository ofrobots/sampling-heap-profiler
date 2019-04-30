import * as fs from 'fs';
import * as pify from 'pify';
import { DevToolsProfileNode } from './index';

const writeFilep = pify(fs.writeFile) as (
  filename: string,
  data: {}
) => Promise<void>;

export async function writeAsync(
  profile: DevToolsProfileNode,
  filename?: string
): Promise<string> {
  if (!filename) {
    filename = `heap-profile-${Date.now()}.heapprofile`;
  }

  await writeFilep(filename, JSON.stringify({ head: profile }));
  return filename;
}
