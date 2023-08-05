const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const {
    createContainer, killContainer,
    compile, execute
} = require('./docker');
const { dateTimeNowFormated, logger } = require('../utils');

// ####################################################################################
// ####################################################################################
const imageIndex = { GCC: 0, PY: 1, JS: 2, JAVA: 3 };
const imageNames = [
    'gcc:latest',
    'python:3.10-slim',
    'node:16.17.0-bullseye-slim',
    'openjdk:20-slim'
];
const containerNames = [
    'gcc-oj-container',
    'py-oj-container',
    'js-oj-container',
    'java-oj-container'
];
/** @type {string[]} */
const containerIds = [];
const initDockerContainer = (image, index) => {
    const name = containerNames[index];
    return new Promise(async (resolve, reject) => {
        try {
            // check and kill already running container
            await killContainer(name);
            // now create new container of image
            const data = await createContainer({ name, image });
            containerIds[index] = data;
            resolve(`${name} Id : ${data}`);
        } catch (error) {
            reject(`${name} Docker Error : ${JSON.stringify(error)}`);
        }
    });
}
const initAllDockerContainers = async () => {
    try {
        const res = await Promise.all(imageNames.map((image, index) => initDockerContainer(image, index)));
        logger.log(res.join('\n'));
        logger.log("\nAll Containers Initialized");
    } catch (error) {
        logger.error("Docker Error: ", error);
        logger.error(dateTimeNowFormated());
    }
}

const languageSpecificDetails = {
    'c': {
        compiledExtension: 'out',
        inputFunction: null,
        containerId: () => containerIds[imageIndex.GCC]
    },
    'cpp': {
        compiledExtension: 'out',
        inputFunction: null,
        containerId: () => containerIds[imageIndex.GCC]
    },
    'py': {
        compiledExtension: '',
        inputFunction: data => (data ? data.split(' ').join('\n') : ''),
        containerId: () => containerIds[imageIndex.PY]
    },
    'js': {
        compiledExtension: '',
        inputFunction: null,
        containerId: () => containerIds[imageIndex.JS]
    },
    'java': {
        compiledExtension: 'class',
        inputFunction: null,
        containerId: () => containerIds[imageIndex.JAVA]
    }
};
// ####################################################################################
// ####################################################################################


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
    if (!languageSpecificDetails[language]) return { msg: languageErrMsg };

    let containerId = languageSpecificDetails[language].containerId();
    if (!containerId) return reject({ msg: languageErrMsg });

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    const { input, output } = require(`./testcases/${testcase}`)

    return new Promise(async (resolve, reject) => {
        try {
            let filename = path.basename(filePath);
            const compiledId = await compile(containerId, filename, language);

            for (let index = 0; index < input.length; ++index) {
                const exOut = await execute(containerId, compiledId,
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

    let containerId = languageSpecificDetails[language].containerId();
    if (!containerId) return { msg: languageErrMsg };

    if (!filePath.includes("\\") && !filePath.includes("/"))
        filePath = path.join(codeDirectory, filePath);

    try {
        let filename = path.basename(filePath);
        const compiledId = await compile(containerId, filename, language);
        const exOut = await execute(containerId, compiledId,
            languageSpecificDetails[language].inputFunction ? languageSpecificDetails[language].inputFunction(inputString) : inputString,
            language
        );
        return ({ msg: "Compiled Successfully", stdout: exOut });
    } catch (error) {
        return error;
    }
}

module.exports = {
    readFile, createFile,
    deleteFile, execCode,
    execCodeAgainstTestcases,
    initAllDockerContainers,
    languageSpecificDetails
};
