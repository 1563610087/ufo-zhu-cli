'use strict';

const path = require('path');
const {isObject} =require('@ufo-zhu/utils')
const pkgDir=require('pkg-dir').sync
const formatePath=require('@ufo-zhu/formate-path');
class Package {
    constructor(options) {
        if(!options){
            throw new Error('Package类的参数options不能为空')
        }
        if(!isObject(options)){
            throw new Error('Package类的参数options必须为对象')
        }
        this.targetPath=options.targetPath
        this.storePath=options.storePath
        this.packageName=options.packageName
        this.packageVersion=options.packageVersion
    }

    //判断包是否存在
    exists() {

    }

    //安装包
    install() {

    }

    //更新包
    updated() {
        
    }

    //获取入口文件
    getRootFilePath() {
        //1、获取package.json的所在目录
        const dir=pkgDir(this.targetPath)
        if(dir){
            //2、读取package.json文件
            const pkgFile=require(path.resolve(dir,'package.json'))
            //3、寻找main/lib
            if(pkgFile||pkgFile.main){
                //4、兼容windows和ios系统
                return formatePath(path.resolve(dir,pkgFile.main))
            }
            // console.log(pkgFile)
            return null
        }
        

    }
}

module.exports = Package;