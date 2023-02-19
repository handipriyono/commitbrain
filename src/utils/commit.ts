
import { intro, select, spinner, confirm, outro, isCancel } from '@clack/prompts'
import { bgLightGray, black, green } from 'kolorist'
import { execa } from 'execa'
import { getStagedDiff } from './git.js'
import { generateCommitMessage, checkAPIKey, counterTotalFile } from '../utils/helper.js'

interface TTypeArgs {
  number: number
  prefix: string[] | any
}

const commitHelp = async (args: TTypeArgs): Promise<any> => {
  const { number, prefix } = args
  intro(bgLightGray(black(' ✔ commitbrain ')))

  const detectingFiles = spinner()
  detectingFiles.start('Detecting staged filesa')
  const stagedItem = await getStagedDiff()

  if (!stagedItem) {
    const errMsg = 'No staged changes found. Make sure to stage your changes with `git add`'
    detectingFiles.stop()
    throw new Error(errMsg)
  }

  const fileString: string = stagedItem?.files?.map((file: any) => `    ✔ ${String(file)}`)?.join('\n')
  detectingFiles.stop(`${counterTotalFile(stagedItem?.files)}:\n${fileString}`)

  const spinnerCheck = spinner()
  spinnerCheck.start('Check changes with AI ')
  const apiKey = await checkAPIKey()
  if (!apiKey) {
    spinnerCheck.stop()
    throw new Error('no API KEY Found')
  }

  const message = await generateCommitMessage({ apiKey, diff: stagedItem?.diff, number })
  spinnerCheck.stop()

  const prefixMsg = String(prefix ? prefix?.join(' ') : '')
  const finalCommitMsg = message?.map((it: string) => {
    return {
      label: `${prefixMsg} ${it}`,
      value: `${prefixMsg} ${it}`
    }
  })
  const selectionCommit = await select({ message: 'Pick commit message: ', options: finalCommitMsg })

  if (!selectionCommit || isCancel(selectionCommit)) {
    outro('Commit cancelled'); return
  }

  const confirmOK = await confirm({ message: `Commit with this message?\n   📌 ${String(selectionCommit)}\n` })

  if (!confirmOK || isCancel(confirmOK)) {
    outro('Commit cancelled'); return
  }
  await execa('git', ['commit', '-m', selectionCommit])
  outro(`${green('✔')} Successfully committed!`)
}

export default commitHelp
