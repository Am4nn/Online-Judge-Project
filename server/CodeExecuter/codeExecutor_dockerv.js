const {
    compileCppCode,
    copyFiles,
    createContainer,
    execOutFile,
    execPyFile
} = require('./docker');

let gccContainerId = null, pythonContainerId = null;
createContainer('gcc')
    .then(data => gccContainerId = data)
    .catch(error => console.error('Docker Error : ', error));
createContainer('python')
    .then(data => pythonContainerId = data)
    .catch(error => console.error('Docker Error : ', error));

const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const codeDirectory = path.join(__dirname, "codeFiles");

// for the first time create 'codeFiles' directory
if (!fs.existsSync(codeDirectory)) {
    fs.mkdirSync(codeDirectory, { recursive: true });
}

const createFile = (fileExtension, content) => {
    const id = uuid();
    const filename = `${id}.${fileExtension}`;
    const filepath = path.join(codeDirectory, filename);
    fs.writeFileSync(filepath, content);
    return filepath;
}

const readFile = filepath => {
    if (!fs.existsSync(filepath))
        return undefined;
    return fs.readFileSync(filepath);
}

const deleteFile = filepath => {
    if (!fs.existsSync(filepath)) return;
    fs.unlinkSync(filepath);
    console.log('unlinked : ', filepath);
}

const execCppCode = (filePath, testcase) => {
    const { input, output } = require(`./testcases/${testcase}`)
    return new Promise(async (resolve, reject) => {
        try {
            const filename = await copyFiles(filePath, gccContainerId);
            const id = await compileCppCode(gccContainerId, filename);

            for (let index = 0; index < input.length; ++index) {
                const exOut = await execOutFile(gccContainerId, id, input[index]);
                // if socket connection established then send to client the index of passed test case
                if (exOut !== output[index]) {
                    reject({
                        msg: 'on wrong answer',
                        stderr: `testcase ${index} failed => testcase : (${input[index]}) => expected : ${output[index]} => your output : ${exOut}`
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


const execPyCode = (filePath, testcase) => {
    let { input, output } = require(`./testcases/${testcase}`)
    return new Promise(async (resolve, reject) => {
        try {
            const filename = await copyFiles(filePath, pythonContainerId);

            for (let index = 0; index < input.length; ++index) {
                const exOut = await execPyFile(pythonContainerId, filename, input[index].replaceAll(' ', '\n'));
                // if socket connection established then send to client the index of passed test case
                if (exOut !== output[index]) {
                    reject({
                        msg: 'on wrong answer',
                        stderr: `testcase ${index} failed => testcase : (${input[index]}) => expected : ${output[index]} => your output : ${exOut}`
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

module.exports = {
    readFile,
    createFile,
    execPyCode,
    deleteFile,
    execCppCode
};