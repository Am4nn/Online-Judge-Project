const path = require("path");
const { logger } = require('../utils/logging');
const { exec, spawn } = require('child_process');
const { codeDirectory, languageErrMsg, stderrMsgFn } = require('./index');

// ####################################################################################
// ####################################################################################

/**
 * @callback CompExecCmd
 * @param {string} id - FileName or FileId
 * @returns {string}

 * @callback InputFn
 * @param {string} data
 * @returns {string}

 * @typedef {Object} ExecDetail
 * @property {(CompExecCmd|null)} compilerCmd
 * @property {CompExecCmd} executorCmd
 * @property {String} compiledExtension
 * @property {InputFn|null} inputFunction
*/
/** @type {Object.<string, ExecDetail>} */
const languageSpecificDetails = {
    'c': {
        compilerCmd: id => `cd ${codeDirectory} && gcc ${id}.c -o ${id}.out -lpthread -lrt`,
        executorCmd: id => `cd ${codeDirectory} && ./${id}.out`,
        compiledExtension: 'out',
        inputFunction: null
    },
    'cpp': {
        compilerCmd: id => `cd ${codeDirectory} && g++ ${id}.cpp -o ${id}.out`,
        executorCmd: id => `cd ${codeDirectory} && ./${id}.out`,
        compiledExtension: 'out',
        inputFunction: null
    },
    'py': {
        compilerCmd: null,
        executorCmd: id => `cd ${codeDirectory} && python ${id}`,
        compiledExtension: '',
        inputFunction: data => (data ? data.split(' ').join('\n') : '')
    },
    'js': {
        compilerCmd: null,
        executorCmd: id => `cd ${codeDirectory} && node ${id}`,
        compiledExtension: '',
        inputFunction: null
    },
    'java': {
        compilerCmd: id => `cd ${codeDirectory} && javac ${id}.java`,
        executorCmd: id => `cd ${codeDirectory} && java Solution`, // TODO: Update 'java Solution', to use id
        compiledExtension: 'class',
        inputFunction: null
    }
};

const initAllDockerContainers = () => logger.log("No Docker required !");

/**
 * Compiles the code
 * @param {String} filename 
 * @param {String} language 
 * @returns {Promise<String|any>} - fileid 
 */
const compile = (filename, language) => {
    const id = filename.split(".")[0];
    const command = languageSpecificDetails[language].compilerCmd ? languageSpecificDetails[language].compilerCmd(id) : null;
    return new Promise((resolve, reject) => {
        if (!command) return resolve(filename);
        exec(command, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(id);
        });
    });
}

/**
 * Executes the compiled code
 * @param {String} id 
 * @param {String} input 
 * @param {String} language 
 * @param {(data:String, type:String, pid:number)=>{}} onProgress - callback triggered on each data or error event
 * @returns {Promise<String|any>}
 */
const execute = (id, input, language, onProgress = null) => {
    const command = languageSpecificDetails[language].executorCmd ? languageSpecificDetails[language].executorCmd(id) : null;
    return new Promise((resolve, reject) => {
        if (!command) return reject('Language Not Supported');
        const cmd = spawn(command, { shell: true });

        let stdout = '';
        let stderr = '';

        if (input) {
            cmd.stdin.write(input);
            cmd.stdin.end();
        }

        cmd.stdin.on('error', err => {
            reject({ msg: 'on stdin error', error: `${err}` });
        });

        cmd.stdout.on('data', (data) => {
            stdout += `${data}`;
            if (onProgress) {
                onProgress(`${data}`, STDOUT, cmd.pid);
            }
        });

        cmd.stderr.on('data', (data) => {
            stderr += `${data}`;
            if (onProgress) {
                onProgress(`${data}`, STDERR, cmd.pid);
            }
        });

        cmd.on('error', (error) => reject(error));

        cmd.on('close', (code) => {
            if (code !== 0) {
                reject(`${stderr}`);
            } else {
                resolve(`${stdout}`.trim());
            }
        });
    });
}

// ####################################################################################
// ####################################################################################


const execCodeAgainstTestcases = (filePath, language, testcase) => {

    // check if language is supported or not
    if (!languageSpecificDetails[language]) return { msg: languageErrMsg };

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    const { input, output } = require(`./testcases/${testcase}`)

    return new Promise(async (resolve, reject) => {
        try {
            const filename = path.basename(filePath);
            const compiledId = await compile(filename, language);

            for (let index = 0; index < input.length; ++index) {
                const exOut = await execute(compiledId,
                    languageSpecificDetails[language].inputFunction ? languageSpecificDetails[language].inputFunction(input[index]) : input[index],
                    language
                );
                // if socket connection established then send to client the index of passed test case
                if (exOut !== output[index]) {
                    reject({
                        msg: 'on wrong answer',
                        stderr: stderrMsgFn({ index, input: input[index], output: output[index], exOut })
                    });
                    break;
                }
            }

            resolve({ msg: 'All Test Cases Passed' });
        } catch (error) {
            reject(error);
        }
    });
}

const execCode = async (filePath, language, inputString) => {

    if (!inputString) inputString = '';

    // check if language is supported or not
    if (!languageSpecificDetails[language]) return { msg: languageErrMsg };

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    try {
        const filename = path.basename(filePath);
        const compiledId = await compile(filename, language);
        const exOut = await execute(compiledId,
            languageSpecificDetails[language].inputFunction ? languageSpecificDetails[language].inputFunction(inputString) : inputString,
            language
        );
        return ({ msg: "Compiled Successfully", stdout: exOut });
    } catch (error) {
        return error;
    }
}

module.exports = {
    execCode,
    execCodeAgainstTestcases,
    initAllDockerContainers,
    languageSpecificDetails
};
