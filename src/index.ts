
import getHelp from './utils/helper.js'
import { checkIsGit } from './utils/git.js'
import commandLineArgs from 'command-line-args'
import { optionDefinitions } from './constant/index.js'
import { outro } from '@clack/prompts'
import { red } from 'kolorist'
import commitHelp from '../src/utils/commit.js'

(async () => {
  const { show: showHelp } = getHelp()
  const resOption: any = commandLineArgs(optionDefinitions)
  if (resOption?.help === true || resOption?.version === true) { return showHelp() }

  const isGit = await checkIsGit()
  if (!isGit) { return }

  await commitHelp(resOption)
})().catch((error: any) => {
  outro(`${red('✖')} ${String(error.message)}`)
  process.exit(1)
})
