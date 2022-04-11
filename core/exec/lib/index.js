'use strict';

const Package = require('@ufo-zhu/package');
const log = require('@ufo-zhu/log');


const SETTINGS={
    'init':"@ufo-zhu/init"
}

function exec() {
    const targetPath=process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME_PATH
    const cmdObj=arguments[arguments.length-1]
    const cmdName=cmdObj.name
    const packageName=SETTINGS[cmdName]
    const packageVersion='latest'
    log.verbose('targetPath',targetPath)
    log.verbose('homePath',homePath)
    const pkg=new Package({
        targetPath,
        packageName,
        packageVersion
    })
    const url=pkg.getRootFilePath()
    
    console.log('url',url)
}

module.exports = exec;
