#! /usr/bin/env/ node

module.exports =core

const pkg = require('../package.json')
const log = require('@ufo-zhu/log')
const constants = require('./const')
const semver = require('semver')
const path = require('path')
const colors = require('colors/safe')
const userHome = require('user-home')
const commander=require('commander')
const pathExists = require('path-exists').sync
const init = require('@ufo-zhu/init')
const exec=require('@ufo-zhu/exec')


const program=new commander.Command()
let args,config
async function core() {
  try {
    await prepare()//项目准备阶段
    registryCommander()//命令注册
  }catch(err) {
    log.error(err.message)
  }

}

async function prepare() {
  checkVersion()//检测当前版本
  checkNodeVersion()//检测node版本
  checkRoot()//检测root启动
  checkUserHome()//检测用户主目录
  checkEnv()//检测环境变量
  // await checkUpdateGlobal()//检查全局更新
}

function registryCommander() {
  program
  .name(Object.keys(pkg.bin)[0])
  .usage('<command> [options]')
  .version(pkg.version)
  .option('-d,--debug','是否开启调试模式',false)
  .option('-tp,--targetPath <targetPath>','是否开启本地调试模式','')
  .action((str, options) => {
    if(str.debug){
      process.env.LOG_LEVEL='verbose'
    }else{
      process.env.LOG_LEVEL='info'
    }
    log.level=process.env.LOG_LEVEL
  })
  //监听未定义的命令功能未实现

  program
  .command('init [projectName]')
  .option('-f','--force','是否强制初始化项目')
  .action(exec)

  program.on('option:targetPath',function(targetPath){
    process.env.CLI_TARGET_PATH=targetPath
  })
  // if(program.args&&program.args.length<1){
  //   program.outputHelp()
  //   console.log()
  // }
  program.parse(process.argv)
  
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