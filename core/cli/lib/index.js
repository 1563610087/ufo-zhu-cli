#! /usr/bin/env/ node

module.exports =core

const pkg = require('../package.json')
const log = require('@ufo-zhu/log')
const constants = require('./const')
const semver = require('semver')
const path = require('path')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
let args,config
async function core() {
  try {
    checkVersion()//检测当前版本
    checkNodeVersion()//检测node版本
    checkRoot()//检测root启动
    checkUserHome()//检测用户主目录
    checkInputArgs()//检测输入参数
    checkEnv()//检测环境变量
    await checkUpdateGlobal()//检查全局更新
  }catch(err) {
    log.error(err.message)
  }

}

async function checkUpdateGlobal() {
  const currentVersion=pkg.version
  const npmName=pkg.name
  const {getNpmServerInfo}=require('@ufo-zhu/get-npm-info')
  const lastVersion= await getNpmServerInfo(currentVersion,'semver')
  if(lastVersion&&semver.gt(lastVersion,currentVersion)){
    log.warn('更新提示',colors.yellow(
      `请手动更新${npmName},当前版本：${currentVersion},最新版本${lastVersion}
更新命令：npm install -g ${npmName}`))
  }
}

function checkEnv() {
  const dotenv=require('dotenv')
  const dotPathEnv=path.resolve(userHome,'.env')
  if(pathExists(dotPathEnv)){
    config=dotenv.config({
      path:dotPath
    })
  }
  createEnvironment()
  log.verbose('环境变量',process.env.CLI_HOME_PATH)
}

function createEnvironment() {
  const cliConfig={
    home:userHome
  }
  if(process.env.CLI_HOME_PATH){
    cliConfig.cliHome=path.join(userHome,process.env.CLI_HOME)
  }else{
    cliConfig.cliHome=path.join(userHome,constants.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH=cliConfig.cliHome
}

function checkInputArgs(){
  let minimist=require('minimist')
  args= minimist(process.argv.slice(2))
  if(args.debug){
    process.env.LOG_LEVEL='verbose'
  }else{
    process.env.LOG_LEVEL='info'
  }
  log.level=process.env.LOG_LEVEL
}

function checkVersion() {
  log.notice('cli',pkg.version)
}

async function checkUserHome() {
  if(!userHome||!pathExists(userHome)){
    throw new Error(colors.red(`当前用户主目录不存在`))
  }
}

function checkNodeVersion() {
  let currentVersion = process.version
  let lowerVersion = constants.LOWEST_NODE_VERSION
  if(!semver.gte(currentVersion, lowerVersion)){
    throw new Error(colors.red(`ufo-cli需要安装v${lowerVersion}以上版本的node.js`))
  }
}

function checkRoot() {
  //linux系统可用
  if (process.getuid) {
    const checkRoot = require('check-root')
    checkRoot()
    console.log(`Current uid: ${process.getuid()}`);
  }
}