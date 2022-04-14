'use strict';

const Command = require('@ufo-zhu/command')
const log = require('@ufo-zhu/log')
class InitCommand extends Command {
    init() {
       this.projectName=this._args[0]||''
       this.force=!!this._cmd.force 
       log.verbose('projectName', this.projectName)
       log.verbose( 'force', this.force)
    }

    exec(){

    }
}

function init(args) {
    // console.log(projectName,process.env.CLI_TARGET_PATH)
    return new InitCommand(args)
}


module.exports = init;