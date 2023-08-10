const fs = require('fs');
const path = require('path');

const codeDirectory = path.join(__dirname, "codeFiles");

// for the first time create 'codeFiles' directory
if (!fs.existsSync(codeDirectory)) {
    fs.mkdirSync(codeDirectory, { recursive: true });
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


module.exports = {
    codeDirectory,
    stderrMsgFn, languageErrMsg
}
