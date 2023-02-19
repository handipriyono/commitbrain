
import commandLineUsage from 'command-line-usage'
import { helpSections, promptMessage } from '../constant/index.js'
import { Configuration, OpenAIApi } from 'openai'
import path from 'path'
import os from 'os'
import fs from 'fs/promises'
import ini from 'ini'

interface TTypeCommitParams {
  apiKey: any
  diff: string
  number?: number
}

export const counterTotalFile = (files: any) => `Found ${String(files?.length)} staged file${files?.length > 1 ? 's' : ''}`

const fileExists = async (filePath: string) => await fs.access(filePath).then(() => true, () => false)

export const getHelp = (): any => {
  return {
    show: () => {
      console.log(commandLineUsage(helpSections))
    }
  }
}

export const getConfigFile = async () => {
  const configPath = path.join(os.homedir(), '.commitbrain')
  const configExists = await fileExists(configPath)
  if (!configExists) {
    return {}
  }

  const configString = await fs.readFile(configPath, 'utf8')
  return ini.parse(configString)
}

export const generateCommitMessage = async ({ apiKey, diff, number = 1 }: TTypeCommitParams): Promise<any> => {
  const prompt = `${promptMessage}\n${diff}`

  if (prompt.length > 8100) {
    throw new Error('The diff is too large for the OpenAI API')
  }

  const openai = new OpenAIApi(new Configuration({ apiKey }))
  try {
    const result = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.75,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 200,
      stream: false,
      n: number
    })
    const mapData = (d: any) => d?.text?.trim().replace(/[\n\r]/g, '').replace(/(\w)\.$/, '$1')
    return result?.data?.choices?.map(it => mapData(it))
  } catch (error) {
    const errorAsAny: any = error
    errorAsAny.message = `OpenAI API Error: ${String(errorAsAny?.message)} - ${String(errorAsAny?.response?.statusText)}`
    throw errorAsAny
  }
}

export const checkAPIKey = async () => {
  const config = await getConfigFile()
  const OPENAI_KEY = process.env.OPENAI_KEY ?? process.env.OPENAI_API_KEY ?? config.OPENAI_KEY
  if (!OPENAI_KEY) {
    throw new Error('Please set your OpenAI API key in ~/.commitbrain\n ->  echo "OPENAI_KEY=<replace with your token>" >> ~/.commitbrain')
  } else {
    return OPENAI_KEY
  }
}

export default getHelp
