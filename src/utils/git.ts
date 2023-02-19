import { execa } from 'execa'
import { red } from 'kolorist'
import { excludeFileGit } from '../constant/index.js'

export const checkIsGit = async (): Promise<boolean> => {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--is-inside-work-tree'], { reject: false })
    if (stdout !== 'true') {
      throw new Error('The current directory must contain git')
    }

    return true
  } catch (error: any) {
    console.log(red(error?.message))
    return false
  }
}

export const getStagedDiff = async (): Promise<any> => {
  const cachedDiff = ['diff', '--cached']
  const { stdout: files } = await execa('git', [...cachedDiff, '--name-only', ...excludeFileGit])
  if (!files) { return }
  const { stdout: diff } = await execa('git', [...cachedDiff, ...excludeFileGit])

  return { diff, files: files?.split('\n') }
}
