const { exec, spawn } = require('child_process');
const { logger } = require('../utils/logging');
const { codeDirectory } = require('./index');

const STDOUT = "stdout", STDERR = "stderr";

/**
 * @param {{name: String, image: String}} - name given to the conatiner and image name
 * @returns {Promise<String>} - returns containerId
 */
const createContainer = ({ name, image }) => {
    return new Promise((resolve, reject) => {
        exec(`docker run -i -d --rm --mount type=bind,src="${codeDirectory}",dst=/codeFiles --name ${name} --label oj=oj ${image}`, (error, stdout, stderr) => {
            (error || stderr) && reject({ msg: 'on docker error', error, stderr });
            const containerId = `${stdout}`.trim();
            resolve(containerId);
        });
    });
}

/**
 * It stops the container instantly, as it brutally stops the container
 * @param {String} container_id_name - container id or container name
 * @returns {Promise<String>} - container id or container name
 */
const killContainer = container_id_name => {
    return new Promise((resolve) => {
        exec(`docker kill ${container_id_name}`, (error, stdout, stderr) => {
            stdout && logger.log('Deleted(stopped) :', stdout);
            resolve(container_id_name);
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
/** @type {Object.<string, ExecDetail>} */
const details = {
    'c': {
        compilerCmd: id => `gcc ./codeFiles/${id}.c -o ./codeFiles/${id}.out -lpthread -lrt`,
        executorCmd: id => `./codeFiles/${id}.out`,
    },
    'cpp': {
        compilerCmd: id => `g++ ./codeFiles/${id}.cpp -o ./codeFiles/${id}.out`,
        executorCmd: id => `./codeFiles/${id}.out`,
    },
    'py': {
        compilerCmd: null,
        executorCmd: id => `python ./codeFiles/${id}`,
    },
    'js': {
        compilerCmd: null,
        executorCmd: id => `node ./codeFiles/${id}`,
    },
    'java': {
        compilerCmd: id => `javac -d ./codeFiles/${id} ./codeFiles/${id}.java`,
        executorCmd: id => `java -cp ./codeFiles/${id} Solution`,
    }
};

/**
 * Compiles the code inside docker container
 * @param {String} containerId 
 * @param {String} filename 
 * @param {String} language 
 * @returns {Promise<String|any>} - fileid 
 */
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

/**
 * Executes the compiled code file or code inside docker container
 * @param {String} containerId 
 * @param {String} filename 
 * @param {String} input 
 * @param {String} language 
 * @param {(data:String, type:String, pid:number)=>{}} onProgress - callback triggered on each data or error event
 * @returns {Promise<String|any>}
 */
const execute = (containerId, filename, input, language, onProgress = null) => {
    const command = details[language].executorCmd ? details[language].executorCmd(filename) : null;
    return new Promise((resolve, reject) => {
        if (!command) return reject('Language Not Supported');
        const cmd = spawn('docker', ['exec', '-i', `${containerId} ${command}`], { shell: true });

        let stdout = '';
        let stderr = '';

        if (input) {
            cmd.stdin.write(input);
            cmd.stdin.end();
        }

        cmd.stdin.on('error', err => {
            reject({ msg: 'on stdin error', error: `${err}` });
        });

        cmd.stdout.on('data', (data) => {
            stdout += `${data}`;
            if (onProgress) {
                onProgress(`${data}`, STDOUT, cmd.pid);
            }
        });

        cmd.stderr.on('data', (data) => {
            stderr += `${data}`;
            if (onProgress) {
                onProgress(`${data}`, STDERR, cmd.pid);
            }
        });

        cmd.on('error', (error) => reject(error));

        cmd.on('close', (code) => {
            if (code !== 0) {
                reject(`${stderr}`);
            } else {
                resolve(`${stdout}`.trim());
            }
        });
    });
}


module.exports = {
    createContainer,
    killContainer,
    compile, execute, STDOUT, STDERR
};
