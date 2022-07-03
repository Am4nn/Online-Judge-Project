import React, { useState } from 'react'
import './App.css';
import BasicForm from './compenents/Form/BasicForm';


const App = () => {

    const [output, setOutput] = useState('');

    const onFormSubmitted = async (name, email, password) => {
        let res = await fetch('http://localhost:5000/api/test/r1', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name, email, password
            })
        });
        const ans = await res.json();
        console.log(ans);
        setOutput(ans);
    }

    return (
        <div className='App'>
            <div className='form-app'>
                <BasicForm onFormSubmitted={onFormSubmitted} />
            </div>
            <div className='outputbox'>
                {output.errors ? output.errors.map(ele => ele.msg).join(', ') : output.result}
            </div>
        </div>
    );
}

// function App() {

//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const nameRef = useRef();
//     const emailRef = useRef();
//     const passwordRef = useRef();

//     const submitHandler = async () => {
//         let res = await fetch('http://localhost:5000/api/test/r1', {
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             method: 'POST',
//             body: JSON.stringify({
//                 name, email, password
//             })
//         });
//         const ans = await res.json();
//         console.log(ans);
//     }

//     return (
//         <Fragment>
//             <div>
//                 <label>Name</label>
//                 <input ref={nameRef} onChange={() => { setName(nameRef.current.value) }} type='text' ></input>
//             </div>
//             <div>
//                 <label>Email</label>
//                 <input ref={emailRef} onChange={() => { setEmail(emailRef.current.value) }} type='email'></input>
//             </div>
//             <div>
//                 <label>Password</label>
//                 <input ref={passwordRef} onChange={() => { setPassword(passwordRef.current.value) }} type='password'></input>
//             </div>
//             <button onClick={submitHandler}>SUBMIT</button>
//         </Fragment>
//     );
// }

export default App;
