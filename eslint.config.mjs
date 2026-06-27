import { importX } from 'eslint-plugin-import-x'
import jsEslint from '@eslint/js'
import customCfg from './misc/custom-eslint-config.mjs'

const fullCfg = [
  jsEslint.configs.recommended,
  importX.flatConfigs.recommended,
  customCfg,
]

export default fullCfg
