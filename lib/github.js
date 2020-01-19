const clui = require('clui')
const configStore = require('configstore')
const Octokit = require('@octokit/rest')
const Spinner = clui.Spinner

const inquirer = require('./inquirer')
const pkg = require('../package.json');

const conf = new configStore(pkg.name)

let octokit

module.exports={
    getInstance : ()=>{
        return octokit
    },
    getStoredGithubToken : ()=>{
        return conf.get('github.token')
    },
    setGithubCredentials : async ()=>{
        const credentials = await inquirer.askGithubCredentials()
        octokit = new Octokit({
            auth : {
                username : credentials.username,
                password : credentials.password
            }
        })
    },
    registerNewToken : async ()=>{
        const status = new Spinner("Authenticating Please Wait...");
        status.start();
        try{
            const response = await octokit.oauthAuthorizations.createAuthorization({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'git-repo-init, the command-line tool for initalizing Git repos'
              });
              const token = response.data.token;
              if(token) {
                conf.set('github.token', token);
                return token;
              } else {
                throw new Error("Missing Token","GitHub token was not found in the response");
              }
            } catch (err) {
              throw err;
            } finally {
              status.stop();
            }
        },
    githubAuth: (token) => {
          octokit = new Octokit({
            auth: token
          });
        },
        
        
    }