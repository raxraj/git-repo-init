const inquirer = require('inquirer')

const files = require('./file')

module.exports = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'inpur',
                message: 'Enter your github username or e-mail address: ',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a valid username or e-mail address'
                    }
                }

            }, {
                name: 'password',
                type: 'password',
                message: 'Enter your password',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {module.exports = {
                        getCurrentDirectoryBase : ()=>{
                            return path.basename(process.cwd)
                        },
                        directoryExists : (filepath)=>{
                            return fs.existsSync(filepath);
                        }
                    }
                        return 'Please enter your password'
                    }
                }
            }
        ]
        return inquirer.prompt(questions);
    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2))
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the repository: ',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a Repo Name'
                    }
                }
            }, {
                type: 'input',
                name: 'description',
                message: 'Optionally Enter a description of the repository',
                default: argv._[1] || null
            }, {
                type: 'list',
                name: 'visibility',
                message: 'Public or Private',
                choices: [
                    'Public', 'Private'
                ],
                default: 'Private'
            }
        ]
        return inquirer.prompt(questions)
    },
    askIgnoreFiles : (fileslist)=>{
        return inquirer.prompt([{
            type : 'checkbox',
            name : 'ignore',
            message : 'Select the files/folders you wish to ignore: ',
            choices : fileslist,
            default: ['node_modules','bower_components']
        }])
    }
}
