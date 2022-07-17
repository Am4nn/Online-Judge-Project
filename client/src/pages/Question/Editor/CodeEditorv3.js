import React from 'react'

import AceEditor from 'react-ace'

import "ace-builds/webpack-resolver"

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'

import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'

const CodeEditorv3 = props => {

    const { code, setCode, language, fontSize } = props;

    let mode = 'c_cpp';
    switch (language) {
        case 'cpp':
            mode = 'c_cpp';
            break;
        case 'java':
            mode = 'java';
            break;
        case 'py':
            mode = 'python';
            break;
        case 'js':
            mode = 'javascript';
            break;
        default:
            mode = 'c_cpp';
    }

    return (
        <AceEditor
            placeholder="Enter your code here"
            mode={mode}
            theme="monokai"
            name="editorv3"
            onLoad={() => console.log('loaded')}
            onChange={value => setCode(value)}
            fontSize={parseInt(fontSize)}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={code}
            width='100%'
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 4,
            }}
        />

    )
}

export default CodeEditorv3;