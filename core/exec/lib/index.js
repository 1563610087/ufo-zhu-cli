'use strict';

const Package = require('@ufo-zhu/package');

function exec() {
    const pkg=new Package()
    console.log(process.env.CLI_TARGET_PATH,2)
}

module.exports = exec;
