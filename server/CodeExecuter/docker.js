const { exec, spawn } = require('child_process');
const path = require('path');
const { fileURLToPath } = require('url');
const { dateTimeNowFormated, logger } = require('../utils');

// name => it is the name to be given to the container
// image => it is the name of image whose container is to be created
const createContainer = ({ name, image }) => {
    return new Promise((resolve, reject) => {
        exec(`docker run -i -d --rm --name ${name} ${image}`, (error, stdout, stderr) => {
            (error || stderr) && reject({ msg: 'on docker error', error, stderr });
            const containerId = `${stdout}`.trim();
            resolve(containerId);
        });
    });
}

// it takes almost 10sec to stop the container, as it 
// sends sigterm and then sigkill signals to processes inside container
const stopContainer = container_id_name => {
    return new Promise((resolve, reject) => {
        exec(`docker stop ${container_id_name}`, (error, stdout, stderr) => {
            stdout && logger.log('Deleted(stopped) :', stdout);
            // error && logger.log(`${error}`);
            // stderr && logger.log(`${stderr}`);
            resolve();
        });
    });
}

// it stops the container instantly, as it brutally stops
const killContainer = container_id_name => {
    return new Promise((resolve, reject) => {
        exec(`docker kill ${container_id_name}`, (error, stdout, stderr) => {
            stdout && logger.log('Deleted(stopped) :', stdout);
            // error && logger.log(`${error}`);
            // stderr && logger.log(`${stderr}`);
            resolve();
        });
    });
}

// this fn copies file from server to docker container (in root directory)
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
 * @description This fn deletes file/files from a container
 * @param {Array | String} filenames
 * @param {String} containerId 
 * @return {Promise}
 */
const deleteFileDocker = (filename, containerId) => {
    return new Promise(async (resolve, reject) => {
        const fileExists = await fileExistsDocker(filename, containerId);
        if (!fileExists) return resolve('file does not exists');
        exec(`docker exec ${containerId} rm ${filename}`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(filename);
        });
    });
}

const fileExistsDocker = (filename, containerId) => {
    return new Promise((resolve, reject) => {
        exec(`docker exec ${containerId} sh -c "test -f '${filename}' && echo 'true'"`, (error, stdout, stderr) => {
            resolve(stdout.trim() === 'true');
        });
    });
}

// C and C++
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
        cmd.stdin.on('error', err => {
            reject({ msg: 'on stdin error', error: `${err}` });
        });
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
            resolve('');
            // logger.log(`child process exited with code ${code}`);
        });
    });
}

// Python
const execPyFile = (containerId, filename, testInput) => {
    return new Promise((resolve, reject) => {
        const cmd = spawn('docker', ['exec', '-i', `${containerId} python ${filename}`], { shell: true });
        cmd.stdin.on('error', err => {
            reject({ msg: 'on stdin error', error: `${err}` });
        });
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
            resolve('');
            // logger.log(`child process exited with code ${code}`);
        });
    });
}

// Javascript
const execJsFile = (containerId, filename, testInput) => {
    return new Promise((resolve, reject) => {
        const cmd = spawn('docker', ['exec', '-i', `${containerId} node ${filename}`], { shell: true });
        cmd.stdin.on('error', err => {
            reject({ msg: 'on stdin error', error: `${err}` });
        });
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
            resolve('');
            // logger.log(`child process exited with code ${code}`);
        });
    });
}

// Java
const compileJavaCode = (containerId, filename) => {
    const id = filename.split(".")[0];
    return new Promise((resolve, reject) => {
        exec(`docker exec ${containerId} javac ${id}.java`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(id);
        });
    });
}

const execJavaClassFile = (containerId, id, testInput) => {
    return new Promise((resolve, reject) => {
        const cmd = spawn('docker', ['exec', '-i', `${containerId} java Solution`], { shell: true });
        cmd.on('spawn', () => { })
        cmd.on('exit', (exitCode, signal) => { })
        cmd.on('error', error => {
            reject({ msg: 'on error', error: `${error.name} => ${error.message}` });
        });
        cmd.on('close', code => {
            // logger.log(`child process exited with code ${code} `);
            resolve('');
        });
        cmd.stdin.on('error', err => {
            reject({ msg: 'on stdin error', error: `${err}` });
        });
        cmd.stderr.on('data', data => {
            reject({ msg: 'on stderr', stderr: `${data}` });
        });
        cmd.stdout.on('data', data => {
            const exOut = `${data}`.trim();
            resolve(exOut);
        });
        cmd.stdin.write(testInput);
        cmd.stdin.end();
    });
}


module.exports = {
    createContainer, stopContainer,
    copyFiles, compileCCode,
    compileCppCode, execOutFile,
    execPyFile, deleteFileDocker,
    execJsFile, compileJavaCode,
    execJavaClassFile, killContainer,
    fileExistsDocker
};
