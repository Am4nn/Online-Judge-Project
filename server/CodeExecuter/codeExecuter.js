const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec, spawn } = require("child_process");

const codeDirectory = path.join(__dirname, "codeFiles");
const outputDirectory = path.join(__dirname, "outputFiles");

// for the first time create 'codeFiles' directory
if (!fs.existsSync(codeDirectory)) {
    fs.mkdirSync(codeDirectory, { recursive: true });
}

// for the first time create 'outputFiles' directory
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

const createFile = (fileExtension, content) => {
    const id = uuid();
    const filename = `${id}.${fileExtension}`;
    const filepath = path.join(codeDirectory, filename);
    fs.writeFileSync(filepath, content);
    return filepath;
}

const deleteFile = filepath => {
    if (!fs.existsSync(filepath)) return;
    fs.unlinkSync(filepath);
    console.log('unlinked : ', filepath);
}

const deleteOutFile = (filepath, extension) => {
    const id = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputDirectory, `${id}.${extension}`);
    if (!fs.existsSync(outPath)) return;
    fs.unlinkSync(outPath);
    console.log('unlinked : ', outPath);
}

const execCppCode = (filePath, testcase) => {
    const { input, output } = require(`./testcases/${testcase}`)
    const id = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputDirectory, `${id}.out`);

    return new Promise((resolve, reject) => {
        exec(
            `g++ "${filePath}" -o "${outPath}"`,
            (error, stdout, stderr) => {
                error && reject({ msg: 'on error', error: `${error.name} => ${error.message}`, stderr });
                stderr && reject({ msg: 'on stderr', stderr });

                let passed = 0;
                input.forEach((testInput, index) => {

                    const cmd = spawn(`"${path.join(outputDirectory, `${id}.out`)}"`, [], { shell: true })
                    cmd.stdin.write(testInput);
                    cmd.stdin.end();
                    cmd.on('error', error => {
                        reject({ msg: 'on error', error: `${error.name} => ${error.message}` });
                    });
                    cmd.stderr.on('data', data => {
                        reject({ msg: 'on stderr', stderr: `${data}` });
                    });
                    cmd.stdout.on('data', data => {
                        const exOut = `${data}`.trim();
                        if (exOut === output[index]) {
                            passed += 1;
                            // if socket connection established then send to client the index of passed test case
                            (passed === input.length) && resolve({ msg: 'All Test Cases Passed' });
                        } else {
                            reject({ msg: 'on wrong answer', stderr: `testcase ${index} failed => testcase : (${testInput}) => expected : ${output[index]} => your output : ${exOut}` });
                        }
                    });
                    cmd.on('close', code => {
                    });
                });

            }
        )
    });
}


const execPyCode = (filePath, testcase) => {
    let { input, output } = require(`./testcases/${testcase}`)

    return new Promise((resolve, reject) => {
        let passed = 0;
        input.forEach((testInput, index) => {
            testInput = testInput.replaceAll(' ', '\n');

            const cmd = spawn(`python "${filePath}"`, [], { shell: true })
            cmd.stdin.write(testInput);
            cmd.stdin.end();
            cmd.on('error', error => {
                reject({ msg: 'on error', error: `${error.name} => ${error.message}` });
            });
            cmd.stderr.on('data', data => {
                reject({ msg: 'on stderr', stderr: `${data}` });
            });
            cmd.stdout.on('data', data => {
                const exOut = `${data}`.trim();
                if (exOut === output[index]) {
                    passed += 1;
                    // if socket connection established then send to client the index of passed test case
                    (passed === input.length) && resolve({ msg: 'All Test Cases Passed' });
                } else {
                    reject({ msg: 'on wrong answer', stderr: `testcase ${index} failed => testcase : (${testInput}) => expected : ${output[index]} => your output : ${exOut}` });
                }
            });
            cmd.on('close', code => {
                console.log(`child closed with code ${code}`);
            });
        });
    });
}

module.exports = {
    createFile,
    execCppCode,
    execPyCode,
    deleteFile,
    deleteOutFile
};