'use strict';

const Package = require('@ufo-zhu/package');
const log = require('@ufo-zhu/log');
const path = require('path');

const SETTINGS={
    // 'init':"@ufo-zhu/init"
    'init':"uglify-js"
}

const CACHE_DIR='dependencies'

async function exec() {
    let targetPath=process.env.CLI_TARGET_PATH
    let pkg=''
    const homePath = process.env.CLI_HOME_PATH
    const cmdObj=arguments[arguments.length-1]
    const cmdName=cmdObj._name
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
        if(await pkg.exists()) {
            //更新package
            await pkg.updated()
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
    // const rootFilePath=pkg.getRootFilePath()
    const rootFilePath='F:\\前端\\脚手架搭建\\ufo-cli\\commands\\init\\lib'
    if(rootFilePath){
        try{
            require(rootFilePath).call(null,Array.from(arguments))
        }catch(e){
            log.error(e.message)
        }
    }
    
}

module.exports = exec;
