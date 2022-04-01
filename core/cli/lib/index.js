#! /usr/bin/env/ node

module.exports =core

const pkg = require('../package.json')
const log = require('@ufo-zhu/log')
const constants = require('./const')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
// const pathExists = require('path-exists')
import {pathExists} from 'path-exists';

function core() {
  try {
    checkVersion()//检测当前版本
    checkNodeVersion()//检测node版本
    checkRoot()//检测root启动
    checkUserHome()//检测用户主目录
    
  }catch(err) {
    log.error(err.message)
  }

}

function checkVersion() {
  log.notice('cli',pkg.version)
}

function checkUserHome() {
  console.log(await pathExists('foo.js'));
  // if(userHome||pathExists(userHome)){
  //   throw new Error(colors.red(`当前用户主目录不存在`))
  // }
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