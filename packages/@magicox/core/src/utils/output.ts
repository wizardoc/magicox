import FS from 'fs-extra'
import Path from 'path'
import { getConfigPath } from './path'

export function appendPath(path: string, appendPath: string) {
  return Path.join(Path.dirname(path), appendPath, Path.basename(path))
}

// write file into config directory
export async function writeInConfig(
  filename: string,
  data: any
): Promise<void> {
  const configPath = await getConfigPath()

  if (!FS.existsSync(configPath)) {
    await FS.mkdir(configPath)
  }

  return FS.writeFile(Path.join(configPath, filename), data)
}
