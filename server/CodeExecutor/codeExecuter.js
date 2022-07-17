const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { exec, spawn } = require("child_process");

const codeDirectory = path.join(__dirname, "codeFiles");
const outputDirectory = path.join(__dirname, "outputFiles");
const testCasesDirectory = path.join(__dirname, "testcases");

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
    const id = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputDirectory, `${id}.out`);

    fs.unlinkSync(filepath);
    fs.unlinkSync(outPath);
}

const execCppCode = (filePath, testcase) => {
    const { input, output } = require(`./testcases/${testcase}`)
    const id = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputDirectory, `${id}.out`);

    return new Promise((resolve, reject) => {
        exec(
            `g++ "${filePath}" -o "${outPath}"`,
            (error, stdout, stderr) => {
                error && reject({ msg: 'on error', error, stderr });
                stderr && reject({ msg: 'on stderr', stderr });

                let passed = 0;
                input.forEach((testInput, index) => {

                    const cmd = spawn(`"${path.join(outputDirectory, `${id}.out`)}"`, [], { shell: true })
                    cmd.stdin.write(testInput);
                    cmd.stdin.end();
                    cmd.on('error', error => {
                        reject({ msg: 'on error', error });
                    });
                    cmd.stderr.on('data', data => {
                        reject({ msg: 'on stderr', stderr: `${data}` });
                    });
                    cmd.stdout.on('data', data => {
                        const exOut = `${data}`.trim();
                        if (exOut === output[index]) {
                            passed += 1;
                            console.log(`testcase ${index} passed !`);
                            (passed === input.length) && resolve({ msg: 'All Test Cases Passed' });
                        } else {
                            reject({ msg: 'on wrong answer', stderr: `testcase ${index} failed => testcase : (${testInput}) => expected : ${output[index]} => your output : ${exOut}` });
                        }
                    });
                    cmd.on('close', code => {
                        console.log(`child process exited with code ${code}`);
                    });
                });

            }
        )
    });
}

module.exports = {
    createFile,
    deleteFile,
    execCppCode
};