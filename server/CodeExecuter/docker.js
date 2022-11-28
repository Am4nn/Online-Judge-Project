const { exec, spawn } = require('child_process');
const path = require('path');

// image => gcc, python
const createContainer = image => {
    return new Promise((resolve, reject) => {
        exec(`docker run -i -d ${image}`, (error, stdout, stderr) => {
            (error || stderr) && reject({ msg: 'on docker error', error, stderr });
            const containerId = stdout.trim();
            console.log(`${image} container id : ${containerId}`)
            resolve(containerId);
        });
    });
}

const stopContainer = containerId => {
    return new Promise((resolve, reject) => {
        exec(`docker stop ${containerId}`, (error, stdout, stderr) => {
            (error || stderr) && reject({ msg: 'on docker error', error, stderr });
            console.log(`Deleted container ${containerId}`);
            resolve(stdout.trim());
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

/**
 * @param {Array | String} filenames
 * @param {String} containerId 
 * @return {Promise}
 */
const deleteFilesDocker = (filenames, containerId) => {
    const filesToBeDeleted = (Array.isArray(filenames) ? filenames.join(' ') : filenames);
    return new Promise((resolve, reject) => {
        exec(`docker exec ${containerId} rm ${filesToBeDeleted}`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(filesToBeDeleted);
        });
    });
}

const compileCCode = (containerId, filename) => {
    const id = filename.split(".")[0];
    return new Promise((resolve, reject) => {
        exec(`docker exec ${containerId} gcc ${id}.c -o ${id}.out -lpthread -lrt`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(id);
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
            // console.log(`child process exited with code ${code}`);
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
            // console.log(`child process exited with code ${code}`);
        });
    });
}

module.exports = {
    createContainer,
    stopContainer,
    copyFiles,
    compileCCode,
    compileCppCode,
    execOutFile,
    execPyFile,
    deleteFilesDocker
};