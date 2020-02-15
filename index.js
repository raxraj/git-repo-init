#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
var fs  = require('fs')
const updateNotifier = require('update-notifier')

const files = require('./lib/file')
const github = require('./lib/github');
const repo = require('./lib/repo')
const pkg = require('./package.json')

clear();

var notifier = updateNotifier({ pkg : pkg})

notifier.notify();


console.log(chalk.cyan(figlet.textSync('GITHUB', {horizontalLayout: "full"})))


const getGithubToken = async()=>{
  let token = github.getStoredGithubToken();
  if(token){
    return token  
  }
  await github.setGithubCredentials();
  token = await github.registerNewToken();
  return token;
}

const run = async () => {
  try {
    if(files.directoryExists('.git')){
        console.log(chalk.red('Already a git Repo.'));
        await repo.removeCurrentRepo();
    }
    const token = await getGithubToken();
    github.githubAuth(token)

    const url = await repo.createRemoteRepo()

    await repo.createGitIgnore()
    await repo.setupRepo(url)

    console.log(chalk.green('All done! Happy Coding :)'));
    
  } catch (error) {
    if(error){
      switch (error.status) {
        case 401:
          console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
          break;
        case 422:
          console.log(chalk.red('There already exists a remote repository with the same name'));
          break;
        default:
          console.log(error);
      }
    }
  }
  }
  run();