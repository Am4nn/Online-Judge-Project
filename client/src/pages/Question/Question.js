import React, { Fragment, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router';

import classes from './Question.module.css';
import CodeEditorv3 from './Editor/CodeEditorv3';
import ButtonCustom from '../../compenents/Button/Button';
import useLocalStorage from '../../hooks/useLocalStorage';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';

import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Options from './Options/Options';
import defaultCodes from './defaultCodes/defaultCodes';
import { SERVER_LINK } from '../../dev-server-link';
import { correctCode } from './correctCodes/index';
import { useSelector } from 'react-redux';

const Question = () => {

    useScrollToTop();

    const { id } = useParams();

    const { loading, error, question } = useFetchProblems(id);

    // not-initialized, submitting, submitted
    const [codeSubmittingState, setcodeSubmittingState] = useState('not-initialized');

    const [codeFontSize, setcodeFontSize] = useState(15);
    const [selectedLang, setSelectedLang] = useLocalStorage('selectedlangoj', 'cpp');
    const [code, setCode] = useState(defaultCodes[selectedLang]);
    const [response, setResponse] = useState([]);

    const endRef = useRef(null);

    const submitHandler = async event => {
        event.preventDefault();

        if (codeSubmittingState === 'submitting') return;

        console.log('submitting code');
        setcodeSubmittingState('submitting');

        try {
            const query = await fetch(
                `${SERVER_LINK}/api/explore/problems/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ code, language: selectedLang, testcase: question.testcase, quesName: question.name })
                }
            );
            const queryData = await query.json();
            setResponse(queryData);

            if (query.ok) {
                const intervalID = setInterval(async () => {
                    const response = await fetch(
                        `${SERVER_LINK}/api/explore/status/${queryData.queryId}`,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: 'GET'
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        clearInterval(intervalID);
                        setcodeSubmittingState('submitted');
                        setResponse(data);
                    }
                    else if (data.status !== 'pending') {
                        clearInterval(intervalID);
                        setcodeSubmittingState('submitted');
                        setResponse({ ...data.output, status: data.status });
                    }
                    // else console.log('status -> pending', data);
                }, 1000);
            }
            else {
                setcodeSubmittingState('submitted');
            }

            endRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            setResponse({ msg: 'caught errors while sending code to server for getting verdict', serverError: JSON.stringify(error) });
            setcodeSubmittingState('submitted');
        }
    }

    const resetCode = () => {
        setCode(defaultCodes[selectedLang]);
    }
    const showCorrectCode = () => {
        setCode(correctCode[question.testcase][selectedLang]);
    }

    return (
        <Fragment>
            {loading && <LoadingSpinner />}
            {!loading && error && (<div>
                <div className='errorTemplate'>
                    <div><span>Msg : </span>Wasn't able to connect to server check if your are not offline or server might not be working !</div>
                    {error && <div><span>Error : </span>{JSON.stringify(error)}</div>}
                </div>
            </div>)}
            {!loading && !error && (
                <div className={classes.contain}>
                    <div className={classes.back}>
                        <div className={classes.codeSnippet}>
                            &#60; go back to questions /&#62;
                        </div>
                        <ButtonCustom to='/questions' color='yellow'>
                            <ArrowBackIcon style={{ marginRight: '0.3em', transform: 'translateX(-12px)', fontSize: '1.2em' }} />
                            Back
                        </ButtonCustom>
                    </div>
                    <div className={classes.head}>
                        <div style={{ display: 'inline-block' }}>
                            <div className={classes.heading}>{question.name}</div>
                            <div className={classes.extraContent}>
                                <div className={classes.level} diff-color={question.difficulty}>{question.difficulty}</div>
                                <div className={classes.succ}>{question.noOfSuccess === 0 ? 0 : ((question.noOfSuccess / question.noOfSubm * 100).toFixed(2))}%<span> Success</span></div>
                                <div className={classes.subm}>{question.noOfSubm} <span>Submissions</span></div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.notHead}>
                        <div className={classes.body}>
                            <div className={classes.desc}>
                                {question.description}
                            </div>
                        </div>
                        {question.examples.map((example, index) => (
                            <div key={index} className={classes.body}>
                                <div className={classes.example} exn={index + 1}>
                                    <div><span>Input : </span>{example.input}</div>
                                    <div><span>Output : </span>{example.output}</div>
                                    {example.explaination && <div><span>Explaination : </span>{example.explaination}</div>}
                                </div>
                            </div>
                        ))}
                        <div className={classes.editor}>
                            <div className={classes.codeSnippet}>
                                &#60; write your code here in <span style={{ color: 'red', textTransform: 'uppercase' }}>{selectedLang}</span> /&#62;
                            </div>

                            <Options
                                favStyle={{
                                    zIndex: '899',
                                    position: 'absolute',
                                    top: '-2rem',
                                    right: '18%'
                                }}
                                resetCode={resetCode}
                                selectedLang={selectedLang}
                                codeFontSize={codeFontSize}
                                setSelectedLang={setSelectedLang}
                                setcodeFontSize={setcodeFontSize}
                                showCorrectCode={showCorrectCode}
                                codeEditable
                                correctCodeAvailable={!!correctCode[question.testcase]}
                            />

                            <div className={classes.editorText}>
                                <CodeEditorv3
                                    selectedLang={selectedLang}
                                    code={code}
                                    setCode={setCode}
                                    language={selectedLang}
                                    fontSize={codeFontSize}
                                />
                            </div>
                        </div>
                        <div className={classes.submitBtn}>
                            <div className={classes.codeSnippet}>
                                &#60;&#160;
                                {codeSubmittingState === 'submitting' ?
                                    'wait for response' : (codeSubmittingState === 'not-initialized' ?
                                        'click here to submit' : 'wanna submit again')}
                                &#160;/&#62;
                            </div>
                            <ButtonCustom to='/' onClick={submitHandler} color='green'>
                                {codeSubmittingState === 'submitting' ? 'Submitting' : 'Submit'}
                                {codeSubmittingState === 'submitting' ? <div className={classes.spin} /> : <SendIcon style={{ marginLeft: '0.6em', fontSize: '1.2em' }} />}
                            </ButtonCustom>
                        </div>
                        {codeSubmittingState !== 'not-initialized' && (
                            <div className={classes.body}>
                                <div style={{ "--col": (response.status === 'success' ? 127 : 0) }} className={classes.response}>
                                    {response.msg &&
                                        <div className={classes.resTextHead}>
                                            <div className={classes.resHead}>Msg: </div>
                                            <div>{response.msg}</div>
                                        </div>
                                    }
                                    {response.stdout &&
                                        <div className={classes.resTextHead}>
                                            <div className={classes.resHead}>STDOUT: </div>
                                            <div>{response.stdout}</div>
                                        </div>
                                    }
                                    {response.stderr &&
                                        <div className={classes.resTextHead}>
                                            <div className={classes.resHead}>STDERR: </div>
                                            <div>{response.stderr}</div>
                                        </div>
                                    }
                                    {response.error &&
                                        <div className={classes.resTextHead}>
                                            <div className={classes.resHead}>Error: </div>
                                            <div>{JSON.stringify(response.error)}</div>
                                        </div>
                                    }
                                    {response.serverError &&
                                        <div className={classes.resTextHead}>
                                            <div className={classes.resHead}>ServerError: </div>
                                            <div>{response.serverError.toString()}</div>
                                        </div>
                                    }
                                    {response.status === 'pending' &&
                                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <LoadingSpinner />
                                        </div>
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                    <div aria-hidden ref={endRef}></div>
                </div>
            )}
        </Fragment >
    )
}

const useFetchProblems = id => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [question, setQuestion] = useState(undefined);

    /** @type {Object.<string, Array>} */
    const problems = useSelector(state => state.questions);

    useEffect(() => {
        setLoading(true);
        setError(undefined);
        setQuestion(undefined);

        if (!problems.isLoading) {

            const matchProblem = problems.questions.find(value => value._id === id);
            if (matchProblem) setQuestion(matchProblem);
            else setError(`No such problem found with id: ${id}`);

            setLoading(false);
        }

    }, [id, problems]);

    return { loading, error, question };
}

// const useFetchProblems = id => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(undefined);
//     const [question, setQuestion] = useState(undefined);

//     useEffect(() => {
//         const controller = new AbortController();
//         const signal = controller.signal;

//         setLoading(true);
//         setError(undefined);
//         setQuestion(undefined);

//         fetch(`${SERVER_LINK}/api/explore/problems/${id}`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 method: 'GET',
//                 signal,
//             })
//             .then(async res => {
//                 if (res.ok) return res.json()
//                 const json = await res.json();
//                 return await Promise.reject(json);
//             })
//             .then(res => {
//                 setQuestion(res);
//                 setLoading(false)
//             })
//             .catch(err => {
//                 if (err.name === "AbortError") {
//                     console.log("Fetch Cancelled !");
//                 } else {
//                     setError(err);
//                     setLoading(false);
//                 }
//             });

//         return () => { controller.abort(); }
//     }, [id]);

//     return { loading, error, question };
// }

const useScrollToTop = (dependencies = []) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}


export default Question;