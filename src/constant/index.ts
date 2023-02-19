
import { version } from './../../package.json'

export const promptMessage = 'Write an insightful but concise Git commit message in a short and complete sentence, in present tense for the following diff without prefacing it with anything:, and don\'t include words "Commit"'
// export const promptMessage = 'Craft a brief, yet meaningful Git message in the present tense for the following changes, without any introductory phrases or the word "Commit".'
export const helpSections = [
  {
    header: 'commitbrain',
    content: `Version: ${version}\nGenerate git commit message wit commitbrain.\n usage: commitbrain [...options] `
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'number',
        alias: 'n',
        typeLabel: '{underline number}',
        description: 'The total number of AI-generated commit messages to be suggested.'
      }, {
        name: 'prefix',
        alias: 'p',
        typeLabel: '{underline string}',
        description: 'Commit message prefix.'
      },
      {
        name: 'version',
        alias: 'v',
        type: Boolean,
        description: 'commitbrain version.'
      },
      {
        name: 'help',
        description: 'Help.',
        type: Boolean
      }
    ]
  }
]

export const optionDefinitions = [
  { name: 'prefix', alias: 'p', multiple: true, type: String },
  { name: 'number', alias: 'n', type: Number },
  { name: 'version', alias: 'v', type: Boolean },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  }
]

export const excludeFileGit = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'].map(name => `:(exclude)${name}`)

export default { optionDefinitions }
