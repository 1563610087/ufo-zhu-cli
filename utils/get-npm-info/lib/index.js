'use strict';

const axios = require('axios');
const semver=require('semver');
const urlJoin = require('url-join');

function getNpmInfo(npmName,registry) {
    if (!npmName){
        return null
    }
    const registryUrl = registry ||getDefaultRegistry()
    const npmInfoUrl=urlJoin(registryUrl,npmName)
    return axios.get(npmInfoUrl).then((response) =>{
        if (response.status==200) {
            return response.data
        }
        return null
    }).catch((err) =>{
        Promise.reject(err)
    })
}

function getSemverVersion(baseVersion,versions) {
    return versions
    .filter(version=>semver.satisfies(version,`^${baseVersion}`))
    .sort((a,b)=>semver.gt(b,a))
}

async function getNpmServerInfo(baseVersion,npmName,registry){
    const versions= await getNpmVersion(npmName,registry)
    const newVersion = getSemverVersion(baseVersion,versions)
    if(newVersion&&newVersion.length>0){
        return newVersion[0]
    }
}

async function getNpmVersion(npmName,registry) {
    const data=await getNpmInfo(npmName,registry)
    if (data){
        return Object.keys(data.versions)
    }else{
        return []
    }
}

function getDefaultRegistry(isOrigin=false) {
    return isOrigin ?'https://registry.npmjs.org':'https://registry.npm.taobao.org'
}
module.exports = {
    getNpmInfo,
    getNpmVersion,
    getNpmServerInfo
};