// ####################################################################################
const imageNames = ['gcc', 'python', 'node', 'openjdk'];
const containerIds = {
    'gcc': '',
    'python': '',
    'node': '',
    'openjdk': ''
}
const containerNamePostfix = '-oj-container';
const containerName = image => image + containerNamePostfix;
const initDockerContainer = image => {
    return new Promise(async (resolve, reject) => {
        try {
            // check and kill already running container
            await killContainer(containerName(image));
            // now create new container of image
            const data = await createContainer({ name: containerName(image), image });
            containerIds[image] = data;
            resolve(`${image} Container Id : ${data}`);
        } catch (error) {
            reject(`${image} Docker Error : ${error}`)
        }
    });
}
const initAllDockerContainers = async () => {
    try {
        const res = await Promise.all(imageNames.map(image => initDockerContainer(image)));
        console.log(res.join('\n'));
        console.log("\nAll Containers Initialized");
    } catch (error) {
        console.error("Docker Error: ", error);
    }
}
// ####################################################################################

const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const {
    compileCCode, compileCppCode,
    copyFiles, createContainer,
    execOutFile, execPyFile,
    deleteFilesDocker, execJsFile,
    compileJavaCode, execJavaClassFile, killContainer
} = require('./docker');

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
        compiledExtension: 'out',
        executor: execOutFile,
        inputFunction: null,
        containerId: () => containerIds['gcc']
    },
    'cpp': {
        compiler: compileCppCode,
        compiledExtension: 'out',
        executor: execOutFile,
        inputFunction: null,
        containerId: () => containerIds['gcc']
    },
    'py': {
        compiler: null,
        compiledExtension: '',
        executor: execPyFile,
        inputFunction: data => (data ? data.split(' ').join('\n') : ''),
        containerId: () => containerIds['python']
    },
    'js': {
        compiler: null,
        compiledExtension: '',
        executor: execJsFile,
        inputFunction: null,
        containerId: () => containerIds['node']
    },
    'java': {
        compiler: compileJavaCode,
        compiledExtension: 'class',
        executor: execJavaClassFile,
        inputFunction: null,
        containerId: () => containerIds['openjdk']
    }
};


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

    let containerId = details[language].containerId();
    if (!containerId) return reject({ msg: languageErrMsg });

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    const { input, output } = require(`./testcases/${testcase}`)

    return new Promise(async (resolve, reject) => {
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
                        stderr: stderrMsgFn({ index, input: input[index], output: output[index], exOut })
                    });
                    break;
                }
            }

            resolve({ msg: 'All Test Cases Passed' });
        } catch (error) {
            reject(error);
        } finally {
            if (!filename) return;
            try {
                let filesToBeDeleted = filename;
                if (isCompiled) {
                    if (language === 'java')
                        filesToBeDeleted += ' Solution.class';
                    else
                        filesToBeDeleted += (' ' + (filename.split('.')[0]) + '.' + details[language].compiledExtension);
                }
                deleteFilesDocker(filesToBeDeleted, containerId);
            } catch (error) {
                console.error('Caught some errors while deleting files from Docker Container', error, containerId);
            }
        }
    });
}

const execCode = async (filePath, language, inputString) => {

    if (!inputString) inputString = '';

    // check if language is supported or not
    if (!details[language]) return { msg: languageErrMsg };

    let containerId = details[language].containerId();
    if (!containerId) return { msg: languageErrMsg };

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
        return error;
    } finally {
        if (!filename) return;
        try {
            let filesToBeDeleted = filename;
            if (isCompiled) {
                if (language === 'java')
                    filesToBeDeleted += ' Solution.class';
                else
                    filesToBeDeleted += (' ' + (filename.split('.')[0]) + '.' + details[language].compiledExtension);
            }
            deleteFilesDocker(filesToBeDeleted, containerId);
        } catch (error) {
            console.error('Caught some errors while deleting files from Docker Container', error, containerId);
        }
    }
}

module.exports = {
    readFile,
    createFile,
    deleteFile,
    execCode,
    execCodeAgainstTestcases,
    initAllDockerContainers
};