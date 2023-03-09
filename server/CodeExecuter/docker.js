const { exec, spawn } = require('child_process');
const path = require('path');
const { logger } = require('../utils');

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
const copyFilesToDocker = (filePath, containerId) => {
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
 * @param {Array | String} filename
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

// ############################################################

/**
 * @callback CompExecCmd
 * @param {string} id - FileName or FileId
 * @returns {string}
*/
/**
 * @typedef {Object} ExecDetail
 * @property {(CompExecCmd|null)} compilerCmd
 * @property {CompExecCmd} executorCmd
*/
/**
 * @type {Object.<string, ExecDetail>}
*/
const details = {
    'c': {
        compilerCmd: id => `gcc ${id}.c -o ${id}.out -lpthread -lrt`,
        executorCmd: id => `./${id}.out`,
    },
    'cpp': {
        compilerCmd: id => `g++ ${id}.cpp -o ${id}.out`,
        executorCmd: id => `./${id}.out`,
    },
    'py': {
        compilerCmd: null,
        executorCmd: id => `python ${id}`,
    },
    'js': {
        compilerCmd: null,
        executorCmd: id => `node ${id}`,
    },
    'java': {
        compilerCmd: id => `javac ${id}.java`,
        executorCmd: id => `java Solution`, // TODO: Update 'java Solution', to use id
    }
};

// Compile
const compile = (containerId, filename, language) => {
    const id = filename.split(".")[0];
    const command = details[language].compilerCmd ? details[language].compilerCmd(id) : null;
    return new Promise((resolve, reject) => {
        if (!command) return resolve(filename);
        exec(`docker exec ${containerId} ${command}`, (error, stdout, stderr) => {
            error && reject({ msg: 'on error', error, stderr });
            stderr && reject({ msg: 'on stderr', stderr });
            resolve(id);
        });
    });
}

// Execute
const execute = (containerId, id, testInput, language) => {
    const command = details[language].executorCmd ? details[language].executorCmd(id) : null;
    return new Promise((resolve, reject) => {
        if (!command) return reject('Language Not Supported');
        const cmd = spawn('docker', ['exec', '-i', `${containerId} ${command}`], { shell: true });
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

// ############################################################



module.exports = {
    createContainer, stopContainer,
    copyFilesToDocker, deleteFileDocker,
    killContainer, fileExistsDocker,
    compile, execute
};
