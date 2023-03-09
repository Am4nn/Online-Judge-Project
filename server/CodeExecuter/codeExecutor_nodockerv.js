const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { dateTimeNowFormated, logger } = require('../utils');
const { exec, spawn } = require('child_process');

// ####################################################################################
// ####################################################################################

const codeDirectory = path.join(__dirname, "codeFiles");

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
const details = {
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

// Compile
const compile = (filename, language) => {
    const id = filename.split(".")[0];
    const command = details[language].compilerCmd ? details[language].compilerCmd(id) : null;
    return new Promise((resolve, reject) => {
        if (!command) return resolve(filename);
        exec(command, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(id);
        });
    });
}

// Execute
const execute = (id, testInput, language) => {
    const command = details[language].executorCmd ? details[language].executorCmd(id) : null;
    return new Promise((resolve, reject) => {
        if (!command) return reject('Language Not Supported');
        const cmd = spawn(command, { shell: true });
        cmd.on('spawn', () => { })
        cmd.stdin.on('error', err => {
            reject({ msg: 'on stdin error', error: `${err}` });
        });
        cmd.stdin.write(testInput);
        cmd.stdin.end();
        cmd.stderr.on('data', data => {
            reject({ msg: 'on stderr', stderr: `${data}` });
        });
        cmd.stdout.on('data', data => {
            const exOut = `${data}`.trim();
            resolve(exOut);
        });
        cmd.on('exit', (exitCode, signal) => { })
        cmd.on('error', error => {
            reject({ msg: 'on error', error: `${error.name} => ${error.message}` });
        });
        cmd.on('close', code => {
            // logger.log(`child process exited with code ${code} `);
            resolve('');
        });
    });
}

// ####################################################################################
// ####################################################################################


// for the first time create 'codeFiles' directory
if (!fs.existsSync(codeDirectory)) {
    fs.mkdirSync(codeDirectory, { recursive: true });
}

const createFile = (fileExtension, content) => {
    const id = uuid();
    const filename = `${id}.${fileExtension}`;
    const filepath = path.join(codeDirectory, filename);
    fs.writeFileSync(filepath, content);
    return { filepath, filename };
}

const readFile = filepath => {
    if (!filepath.includes("\\") && !filepath.includes("/"))
        filepath = path.join(codeDirectory, filepath);

    if (!fs.existsSync(filepath))
        return undefined;
    return fs.readFileSync(filepath);
}

const deleteFile = filepath => {
    if (!filepath.includes("\\") && !filepath.includes("/"))
        filepath = path.join(codeDirectory, filepath);

    if (!fs.existsSync(filepath)) return;
    fs.unlinkSync(filepath);
    logger.log('Unlinked :', path.basename(filepath));
}

const stderrMsgFn = ({ index, input, output, exOut }) => `Testcase ${index} Failed 
Testcase: 
${input} 
Expected Output: 
${output} 
Your Output: 
${exOut}`;

const languageErrMsg = `Please select a language / valid language.
Or may be this language is not yet supported !`

const execCodeAgainstTestcases = (filePath, testcase, language) => {

    // check if language is supported or not
    if (!details[language]) return { msg: languageErrMsg };

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    const { input, output } = require(`./testcases/${testcase}`)

    return new Promise(async (resolve, reject) => {
        let filename = null;
        try {
            filename = path.basename(filePath);
            const compiledId = await compile(filename, language);

            for (let index = 0; index < input.length; ++index) {
                const exOut = await execute(compiledId,
                    details[language].inputFunction ? details[language].inputFunction(input[index]) : input[index],
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
        } finally {
            try {
                if (filename)
                    deleteFile(filename);

                if (filename && details[language].compiledExtension) {
                    // TODO: Update 'Solution.class' to id.class
                    deleteFile(
                        ((language === 'java') ? 'Solution.class' : ((filename.split('.')[0]) + '.' + details[language].compiledExtension))
                    );
                }
            } catch (error) {
                logger.error('Caught some errors while deleting files from Docker Container', error, dateTimeNowFormated());
            }
        }
    });
}

const execCode = async (filePath, language, inputString) => {

    if (!inputString) inputString = '';

    // check if language is supported or not
    if (!details[language]) return { msg: languageErrMsg };

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    let filename = null;
    try {
        filename = path.basename(filePath);
        const compiledId = await compile(filename, language);
        const exOut = await execute(compiledId,
            details[language].inputFunction ? details[language].inputFunction(inputString) : inputString,
            language
        );
        return ({ msg: "Compiled Successfully", stdout: exOut });
    } catch (error) {
        return error;
    } finally {
        try {
            if (filename)
                deleteFile(filename);

            if (filename && details[language].compiledExtension) {
                // TODO: Update 'Solution.class' to id.class
                deleteFile(
                    ((language === 'java') ? 'Solution.class' : ((filename.split('.')[0]) + '.' + details[language].compiledExtension))
                );
            }
        } catch (error) {
            logger.error('Caught some errors while deleting files from Docker Container', error, dateTimeNowFormated());
        }
    }
}

module.exports = {
    readFile, createFile,
    deleteFile, execCode,
    execCodeAgainstTestcases,
    initAllDockerContainers
};
