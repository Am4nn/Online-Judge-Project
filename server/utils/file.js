const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { logger } = require('./logging');
const { codeDirectory } = require('../CodeExecuter/index');

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

const deleteFolderRecursive = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const currentPath = path.join(folderPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Recursive call for directories
                deleteFolderRecursive(currentPath);
            } else {
                // Delete files
                fs.unlinkSync(currentPath);
                logger.log('Unlinked :', path.basename(currentPath));
            }
        });
        fs.rmdirSync(folderPath);
        logger.log('Unlinked folder :', path.basename(folderPath));
    }
}

module.exports = {
    createFile, readFile, deleteFile,
    deleteFolderRecursive
}