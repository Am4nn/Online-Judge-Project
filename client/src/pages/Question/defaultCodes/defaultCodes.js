const defaultCppCode =
    `#include <bits/stdc++.h>
using namespace std;
int main()
{
    cout << "Hello World" << endl;
    return 0;
}
`;

const defaultCCode =
    `#include <stdio.h>
int main()
{
    printf("Hello World\\n");
    return 0;
}
`;

const defaultJsCode =
    `console.log("Hello World")
`;

const defaultPythonCode =
    `print("Hello World")
`;

const defaultJavaCode =
    `// Don't make any public class,
// use this Solution class because its main() function
// will be called while compilation and execuation.
// There must be Solution class in your java code !

class Solution {
    public static void main(String[] args) {
        System.out.println("Hello From Java");
    }
}
`;

const defaultCodes = {
    c: defaultCCode,
    cpp: defaultCppCode,
    py: defaultPythonCode,
    js: defaultJsCode,
    java: defaultJavaCode,
};

export default defaultCodes;
