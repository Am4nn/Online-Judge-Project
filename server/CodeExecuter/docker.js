const { exec, spawn } = require('child_process');
const path = require('path');

// use promisify

// image => gcc, python
const createContainer = image => {
    return new Promise((resolve, reject) => {
        exec(`docker run -i -d ${image}`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            const containerId = stdout;
            resolve(containerId.trim());
        });
    });
}

const copyFiles = (filePath, containerId) => {
    const filename = path.basename(filePath);
    return new Promise((resolve, reject) => {
        exec(`docker cp "${filePath}" ${containerId}:/${filename}`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(filename);
        });
    });
}

const compileCppCode = (containerId, filename) => {
    const id = filename.split(".")[0];
    return new Promise((resolve, reject) => {
        exec(`docker exec ${containerId} g++ ${id}.cpp -o ${id}.out`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(id);
        });
    });
}

const execOutFile = (containerId, id, testInput) => {
    return new Promise((resolve, reject) => {
        const cmd = spawn('docker', ['exec', '-i', `${containerId} ./${id}.out`], { shell: true });
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
            resolve(exOut);
        });
        cmd.on('close', code => {
            console.log(`child process exited with code ${code}`);
        });
    });
}

const execPyFile = (containerId, filename, testInput) => {
    return new Promise((resolve, reject) => {
        const cmd = spawn('docker', ['exec', '-i', `${containerId} python ${filename}`], { shell: true });
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
            resolve(exOut);
        });
        cmd.on('close', code => {
            console.log(`child process exited with code ${code}`);
        });
    });
}

module.exports = {
    createContainer,
    copyFiles,
    compileCppCode,
    execOutFile,
    execPyFile
};