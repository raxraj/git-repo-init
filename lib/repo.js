const CLI = require('clui')
const fs = require('fs')
const chalk = require('chalk')
const git = require('simple-git/promise')();
const Spinner = CLI.Spinner
const _ = require('lodash')
const touch = require('touch')

const inquirer = require('./inquirer')
const gh = require('./github')

module.exports={
    createRemoteRepo : async ()=>{
        const github = gh.getInstance()
        const answers = await inquirer.askRepoDetails()

        const data = {
            name : answers.name,
            description : answers.description,
            private : (answers.visibility==='Private'),
        }

        const status = new Spinner('Creating remote repository...');
        status.start();

        try {
            const response = await github.repos.createForAuthenticatedUser(data)
            return response.data.ssh_url;
        } catch (error) {
            throw error
        }
        finally{
            status.stop()
        }
    },
    createGitIgnore : async()=>{
        const filelist = _.without(fs.readdirSync('.'),'.git' , '.gitignore')
        if(filelist.length){
            const answers = await inquirer.askIgnoreFiles(filelist)
            if(answers.ignore.length){
                fs.writeFileSync('.gitignore',answers.ignore.join('\n'))
            }
            else{
                touch('.gitignore')
            }
        }
        else{
            touch('.gitignore');
        }
    },
    setupRepo : async (url)=>{
        const status = new Spinner('Initializing local repository and pushing to remote...')
        status.start();

        return git.init()
        .then(git.add('.gitignore'))
        .then(git.add('./*'))
        .then(git.commit('Initial commit'))
        .then(git.addRemote('origin', url))
        .then(git.push('origin', 'master'))
        .finally(status.stop());
    },
    removeCurrentRepo : async()=>{
        const answer = await inquirer.removeCurrentRepo()
        if(answer.delete === 'Yes'){
        //DELETE GIT AND CONTINUE
        fs.unlinkSync('.gitignore')
        fs.rmdirSync('.git' , {recursive : true})
        }
        else{
        console.log(chalk.yellow('No Repository Initialised as Repo already exists.'));
        
        process.exit()
        }
    }
}