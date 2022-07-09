import React, { useEffect, useState } from "react";

import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

const CodeEditor = props => {
    const { fontSize, fontFamily, language, onValueChange } = props;

    const [code, setCode] = useState(
        `#include <bits/stdc++.h>\nusing namespace std;\n\nint main(){\n  int a, b;\n  cin >> a >> b;\n  cout << "Sum of a+b: " << a + b;\n}`
    );

    useEffect(() => {
        onValueChange(code);
    }, [code, onValueChange]);

    return (
        <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: parseInt(fontSize),
            }}
        />
    );
}

export default CodeEditor;