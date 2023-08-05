export const LOGIN = 'login', REGISTER = 'register', CHANGEPASSWORD = 'changePassword';

export const errorFormatter = err => {
    let errorString = `${JSON.stringify(err)} \n`;
    err.status && (errorString += `status: ${err.status} \n`);
    err.statusText && (errorString += `statusText: ${err.statusText} \n`);
    err.type && (errorString += `type: ${err.type} \n`);
    err.redirected && (errorString += `redirected: ${err.redirected} \n`);
    err.ok && (errorString += `ok: ${err.ok} \n`);
    err.headers && (errorString += `headers: ${JSON.stringify(err.headers)} \n`);
    err.body && (errorString += `body: ${JSON.stringify(err.body)} \n`);
    return <div style={{ display: 'inline', whiteSpace: 'pre' }}>{errorString}</div>;
}
