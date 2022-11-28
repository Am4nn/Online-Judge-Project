const {
    compileCCode,
    compileCppCode,
    copyFiles,
    createContainer,
    execOutFile,
    execPyFile,
    deleteFilesDocker
} = require('./docker');

let gccContainerId = null, pythonContainerId = null;
const initDockerGcc = () => {
    createContainer('gcc')
        .then(data => (gccContainerId = data))
        .catch(error => { console.error('GCC Docker Error : ', error) });
}
const initDockerPython = () => {
    createContainer('python')
        .then(data => (pythonContainerId = data))
        .catch(error => { console.error('PYTHON Docker Error : ', error) });
}

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
    console.log('Unlinked :', path.basename(filepath));
}

const details = {
    'c': {
        compiler: compileCCode,
        executor: execOutFile,
        inputFunction: null
    },
    'cpp': {
        compiler: compileCppCode,
        executor: execOutFile,
        inputFunction: null
    },
    'py': {
        compiler: null,
        executor: execPyFile,
        inputFunction: data => (data ? data.split(' ').join('\n') : '')
    }
};

const execCodeAgainstTestcases = (filePath, testcase, language) => {

    let containerId = null;
    switch (language) {
        case 'c': containerId = gccContainerId; break;
        case 'cpp': containerId = gccContainerId; break;
        case 'py': containerId = pythonContainerId; break;
    }

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    const { input, output } = require(`./testcases/${testcase}`)

    return new Promise(async (resolve, reject) => {
        if (!containerId) return reject({ msg: 'Please select a language / valid language !' });

        let filename = null, isCompiled = false;
        try {
            filename = await copyFiles(filePath, containerId);
            let compiledId = filename;
            if (details[language].compiler) {
                compiledId = await details[language].compiler(containerId, filename);
                isCompiled = true;
            }

            for (let index = 0; index < input.length; ++index) {
                const exOut = await details[language].executor(
                    containerId,
                    compiledId,
                    details[language].inputFunction ? details[language].inputFunction(input[index]) : input[index]
                );
                // if socket connection established then send to client the index of passed test case
                if (exOut !== output[index]) {
                    reject({
                        msg: 'on wrong answer',
                        stderr:
                            `Testcase ${index} Failed 
Testcase: 
${input[index]} 
Expected Output: 
${output[index]} 
Your Output: 
${exOut}`
                    });
                    break;
                }
            }

            resolve({ msg: 'All Test Cases Passed' });
        } catch (error) {
            reject(error);
        } finally {
            let filesToBeDeleted = filename;
            if (isCompiled)
                filesToBeDeleted += (' ' + (filename.split('.')[0]) + '.out');
            deleteFilesDocker(filesToBeDeleted, containerId);
        }
    });
}

const execCode = async (filePath, language, inputString) => {
    if (!inputString) inputString = '';

    let containerId = null;
    switch (language) {
        case 'c': containerId = gccContainerId; break;
        case 'cpp': containerId = gccContainerId; break;
        case 'py': containerId = pythonContainerId; break;
    }

    if (!containerId) return { msg: 'Please select a language / valid language !' };

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    let filename = null, isCompiled = false;
    try {
        filename = await copyFiles(filePath, containerId);
        let compiledId = filename;
        if (details[language].compiler) {
            compiledId = await details[language].compiler(containerId, filename);
            isCompiled = true;
        }

        const exOut = await details[language].executor(
            containerId,
            compiledId,
            details[language].inputFunction ? details[language].inputFunction(inputString) : inputString
        );

        return ({ msg: "Compiled Successfully", stdout: exOut });
    } catch (error) {
        return (error);
    } finally {
        let filesToBeDeleted = filename;
        if (isCompiled)
            filesToBeDeleted += (' ' + (filename.split('.')[0]) + '.out');
        deleteFilesDocker(filesToBeDeleted, containerId);
    }
}


// const execCppCode = (filePath, testcase) => {

//     if (!filePath.includes("\\") && !filePath.includes("/"))
//         filePath = path.join(codeDirectory, filePath);

//     const { input, output } = require(`./testcases/${testcase}`)

//     return new Promise(async (resolve, reject) => {
//         try {
//             const filename = await copyFiles(filePath, gccContainerId);
//             const id = await compileCppCode(gccContainerId, filename);

//             for (let index = 0; index < input.length; ++index) {
//                 const exOut = await execOutFile(gccContainerId, id, input[index]);
//                 // if socket connection established then send to client the index of passed test case
//                 if (exOut !== output[index]) {
//                     reject({
//                         msg: 'on wrong answer',
//                         stderr: `testcase ${index} failed => testcase : (${input[index]}) => expected : ${output[index]} => your output : ${exOut}`
//                     });
//                     break;
//                 }
//             }

//             resolve({ msg: 'All Test Cases Passed' });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// const execPyCode = (filePath, testcase) => {

//     if (!filePath.includes("\\") && !filePath.includes("/"))
//         filePath = path.join(codeDirectory, filePath);

//     let { input, output } = require(`./testcases/${testcase}`)
//     return new Promise(async (resolve, reject) => {
//         try {
//             const filename = await copyFiles(filePath, pythonContainerId);

//             for (let index = 0; index < input.length; ++index) {
//                 const exOut = await execPyFile(pythonContainerId, filename, input[index].split(' ').join('\n'));
//                 // if socket connection established then send to client the index of passed test case
//                 if (exOut !== output[index]) {
//                     reject({
//                         msg: 'on wrong answer',
//                         stderr: `testcase ${index} failed => testcase : (${input[index]}) => expected : ${output[index]} => your output : ${exOut}`
//                     });
//                     break;
//                 }
//             }

//             resolve({ msg: 'All Test Cases Passed' });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

module.exports = {
    readFile,
    createFile,
    deleteFile,
    execCode,
    execCodeAgainstTestcases,
    initDockerGcc,
    initDockerPython
};