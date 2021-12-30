import { build } from 'sonolus.js'
import { engine } from './engine'
import { level } from './level'

/*
 * [index.ts]
 * build/serve時に読み込まれるスクリプト
 *  1 engineとlevelフォルダ内のソースをimportする
 *  2 ビルドを行う
 *  3 buildOutputとしてexportする
*/

export const buildOutput = build({
    engine,
    level,
})
