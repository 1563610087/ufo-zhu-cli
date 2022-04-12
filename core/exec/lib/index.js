'use strict';

const Package = require('@ufo-zhu/package');
const log = require('@ufo-zhu/log');
const path = require('path');

const SETTINGS={
    'init':"@ufo-zhu/init"
}

const CACHE_DIR='dependencies'

async function exec() {
    let targetPath=process.env.CLI_TARGET_PATH
    let pkg=''
    const homePath = process.env.CLI_HOME_PATH
    const cmdObj=arguments[arguments.length-1]
    const cmdName=cmdObj.name
    const packageName=SETTINGS[cmdName]
    const packageVersion='latest'
    let storePath=''
    if(!targetPath){
        targetPath=path.resolve(homePath,CACHE_DIR)
        storePath=path.resolve(targetPath,'node_modules')
        log.verbose('targetPath',targetPath)
        log.verbose('homePath',homePath)
        pkg=new Package({
            targetPath,
            storePath,
            packageName,
            packageVersion
        })
        if(pkg.exists()) {
            //更新package
        }else{
            //安装package
            await pkg.install()
        }
    }else{
        pkg=new Package({
            targetPath,
            packageName,
            packageVersion
        })
    }
    const rootFilePath=pkg.getRootFilePath()
    if(rootFilePath){
        require(rootFilePath).apply(null,arguments)
    }
    
}

module.exports = exec;
