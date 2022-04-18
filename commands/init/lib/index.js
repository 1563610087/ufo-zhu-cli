'use strict';

const Command = require('@ufo-zhu/command')
const fs = require('fs')
const fsExtra = require('fs-extra')
const inquirer = require('inquirer')
const log = require('@ufo-zhu/log')
const semver = require('semver')

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

const TEMPLATE_TYPE_NORMAL = 'normal';
const TEMPLATE_TYPE_CUSTOM = 'custom';

const WHITE_COMMAND = ['npm', 'cnpm'];
class InitCommand extends Command {
    init() {
        this.projectName = this._args[0] || ''
        this.force = !!this._cmd.force
        log.verbose('projectName', this.projectName)
        log.verbose('force', this.force)
    }

    async exec() {
        try {
            // 1. 准备阶段
            const projectInfo = await this.prepare();
            this.getProjectInfo()
            // if (projectInfo) {
            //   // 2. 下载模板
            //   log.verbose('projectInfo', projectInfo);
            //   this.projectInfo = projectInfo;
            //   await this.downloadTemplate();
            //   // 3. 安装模板
            //   await this.installTemplate();
            // }
        } catch (e) {
            log.error(e.message);
            if (process.env.LOG_LEVEL === 'verbose') {
                console.log(e);
            }
        }
    }

    async prepare() {
        //1、判断当前目录是否为空
        const localPath = process.cwd()

        if (!this.isDirEmpty(localPath)) {
            const { ifContinue } = await inquirer.prompt({
                type: 'confirm',
                name: 'ifContinue',
                default: false,
                message: '当前文件夹不为空，是否继续创建项目'
            })
            console.log(localPath)
            if (ifContinue) {
                //给用户做二次确认
                const { confirmDelete } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'confirmDelete',
                    default: false,
                    message: '是否确认清空当前目录下的文件？'
                })
                if (confirmDelete) {
                    //清空当前目录
                    // fsExtra.emptyDirSync(localPath)
                }
            } else {
                return
            }
        }

        //3、选择创建项目或组件
        //4、获取项目的基本信息
    }

    // async getProjectInfo() {
    //     function isValidName(v) {
    //       return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    //     }
    //     let projectInfo = {};
    //     let isProjectNameValid = false;
    //     if (isValidName(this.projectName)) {
    //       isProjectNameValid = true;
    //       projectInfo.projectName = this.projectName;
    //     }
    //     // 1. 选择创建项目或组件
    //     const { type } = await inquirer.prompt({
    //       type: 'list',
    //       name: 'type',
    //       message: '请选择初始化类型',
    //       default: TYPE_PROJECT,
    //       choices: [{
    //         name: '项目',
    //         value: TYPE_PROJECT,
    //       }, {
    //         name: '组件',
    //         value: TYPE_COMPONENT,
    //       }],
    //     });
    //     log.verbose('type', type);
    //     this.template = this.template.filter(template =>
    //       template.tag.includes(type));
    //     const title = type === TYPE_PROJECT ? '项目' : '组件';
    //     const projectNamePrompt = {
    //       type: 'input',
    //       name: 'projectName',
    //       message: `请输入${title}名称`,
    //       default: '',
    //       validate: function(v) {
    //         const done = this.async();
    //         setTimeout(function() {
    //           // 1.首字符必须为英文字符
    //           // 2.尾字符必须为英文或数字，不能为字符
    //           // 3.字符仅允许"-_"
    //           if (!isValidName(v)) {
    //             done(`请输入合法的${title}名称`);
    //             return;
    //           }
    //           done(null, true);
    //         }, 0);
    //       },
    //       filter: function(v) {
    //         return v;
    //       },
    //     };
    //     const projectPrompt = [];
    //     if (!isProjectNameValid) {
    //       projectPrompt.push(projectNamePrompt);
    //     }
    //     projectPrompt.push({
    //         type: 'input',
    //         name: 'projectVersion',
    //         message: `请输入${title}版本号`,
    //         default: '1.0.0',
    //         validate: function(v) {
    //           const done = this.async();
    //           setTimeout(function() {
    //             if (!(!!semver.valid(v))) {
    //               done('请输入合法的版本号');
    //               return;
    //             }
    //             done(null, true);
    //           }, 0);
    //         },
    //         filter: function(v) {
    //           if (!!semver.valid(v)) {
    //             return semver.valid(v);
    //           } else {
    //             return v;
    //           }
    //         },
    //       },
    //       {
    //         type: 'list',
    //         name: 'projectTemplate',
    //         message: `请选择${title}模板`,
    //         choices: this.createTemplateChoice(),
    //       });
    //     if (type === TYPE_PROJECT) {
    //       // 2. 获取项目的基本信息
    //       const project = await inquirer.prompt(projectPrompt);
    //       projectInfo = {
    //         ...projectInfo,
    //         type,
    //         ...project,
    //       };
    //     } else if (type === TYPE_COMPONENT) {
    //       const descriptionPrompt = {
    //         type: 'input',
    //         name: 'componentDescription',
    //         message: '请输入组件描述信息',
    //         default: '',
    //         validate: function(v) {
    //           const done = this.async();
    //           setTimeout(function() {
    //             if (!v) {
    //               done('请输入组件描述信息');
    //               return;
    //             }
    //             done(null, true);
    //           }, 0);
    //         },
    //       };
    //       projectPrompt.push(descriptionPrompt);
    //       // 2. 获取组件的基本信息
    //       const component = await inquirer.prompt(projectPrompt);
    //       projectInfo = {
    //         ...projectInfo,
    //         type,
    //         ...component,
    //       };
    //     }
    //     // 生成classname
    //     if (projectInfo.projectName) {
    //       projectInfo.name = projectInfo.projectName;
    //       projectInfo.className = require('kebab-case')(projectInfo.projectName).replace(/^-/, '');
    //     }
    //     if (projectInfo.projectVersion) {
    //       projectInfo.version = projectInfo.projectVersion;
    //     }
    //     if (projectInfo.componentDescription) {
    //       projectInfo.description = projectInfo.componentDescription;
    //     }
    //     return projectInfo;
    //   }
    
    isValidName(v) {
          return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
        }

    async getProjectInfo() {
        const { type } = await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '请选择初始化类型',
            default: TYPE_PROJECT,
            choices: [{
                name: '项目',
                value: TYPE_PROJECT
            }, {
                name: '组件',
                value: TYPE_COMPONENT
            }]
        })
        console.log(type)
        if (type === TYPE_PROJECT) {
            const o = await inquirer.prompt([{
                type: 'input',
                name: 'projectName',
                message: '请输入项目名称',
                default: '',
                validate: function (v) {
                    // const done = this.async();
                    // setTimeout(function () {
                    //     // 1.首字符必须为英文字符
                    //     // 2.尾字符必须为英文或数字，不能为字符
                    //     // 3.字符仅允许"-_"
                    //     if (!this.isValidName(v)) {
                    //         done(`请输入合法的${title}名称`);
                    //         return;
                    //     }
                    //     done(null, true);
                    // }, 0);
                    return true
                },
                filter: function (v) {
                    return v
                }
            }, {
                type: 'input',
                name: 'projectVersion',
                message: '请输入项目版本号',
                default: '1.0.0',
                validate: function (v) {
                    const done = this.async();
                    setTimeout(function () {
                        if (!(!!semver.valid(v))) {
                            done('请输入合法的版本号');
                            return;
                        }
                        done(null, true);
                    }, 0);
                },
                filter: function (v) {
                    // if (!(!!semver.valid(v))) {
                    //     done('请输入合法的版本号');
                    //     return !semver.valid(v)
                    // }
                    // return semver.valid(v)
                    if (!!semver.valid(v)) {
                        return semver.valid(v)
                    } else {
                        return v
                    }
                }
            }
            ])
            console.log(o)

        } else if (type = TYPE_COMPONENT) {

        }
    }

    isDirEmpty(localPath) {
        let fileList = fs.readdirSync(localPath);
        // 文件过滤的逻辑
        fileList = fileList.filter(file => (
            !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
        ));
        return !fileList || fileList.length <= 0;
    }
}

function init(args) {
    // console.log(projectName,process.env.CLI_TARGET_PATH)
    return new InitCommand(args)
}


module.exports = init;