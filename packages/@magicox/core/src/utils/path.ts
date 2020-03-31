import FS from 'fs-extra'
import Path from 'path'
import { logger } from '@magicox/lib'
import { configure } from '../services'

const CONFIG_DIRECTORY_NAME = '.magicox'

export async function getConfigPath(): Promise<string> {
  const rootPath = await findRootPath()

  return Path.join(rootPath, CONFIG_DIRECTORY_NAME)
}

export function getCWD() {
  return process.cwd()
}

export async function getDistPath() {
  const projectConfig = await configure.getConfig()

  return Path.join(await findRootPath(), projectConfig.distPath)
}

// find the root path of project
export async function findRootPath(
  path: string | undefined = process.cwd()
): Promise<string> {
  if (path === '/') {
    logger.panic('Please make sure this is a NPM pkg.')

    return ''
  }

  const preLevelPath = Path.join(path, '..')

  try {
    const currentFiles = await FS.readdir(path)
    const hasPkgJSON = currentFiles.includes('package.json')

    if (hasPkgJSON) {
      return path
    }
  } catch {
    logger.panic('Please make sure this is a NPM pkg.')
  }

  return findRootPath(preLevelPath)
}
