import React, { Fragment, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import LoadingSpinner from '../../compenents/LoadingSpinner/LoadingSpinner';
import useFetch from '../../hooks/useFetch';
import classes from './Question.module.css';

import CodeEditor from './Editor/CodeEditor';
import Button from '../../compenents/Button/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const Question = () => {
    const { id } = useParams();

    const { loading, error, value: question } = useFetch(
        `http://localhost:5000/api/explore/problems/${id}`,
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET',
        },
        [id]
    )

    const navigator = useNavigate();
    const backHandler = () => navigator(-1);

    // not-initialized, submitting, response-ok, response-not-ok, error
    const [codeSubmittingState, setcodeSubmittingState] = useState('not-initialized');
    const [code, setCode] = useState('');
    const [codeFont, setCodeFont] = useState(15);
    const [selectedLang, setSelectedLang] = useState('CPP');
    const onValueChange = useCallback(code => setCode(code), [])

    const submitHandler = async event => {
        event.preventDefault();
        if (codeSubmittingState === 'submitting') return;

        console.log('submitting code');

        setcodeSubmittingState('submitting');

        // after getting response from server setcodeSubmittingState to false

        try {
            const response = await fetch(
                `http://localhost:5000/api/explore/problems/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ code }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setcodeSubmittingState('response-ok');
                console.log(data);
            }
            else {
                setcodeSubmittingState('response-not-ok');
                console.log('response not ok', response);
            }
        } catch (error) {
            console.log('caught errors while sending code to server for getting verdict', error);
            setcodeSubmittingState('error');
        }
    }

    return (
        <Fragment>
            {loading && <LoadingSpinner />}
            {!loading && error && <div>{error}</div>}
            {!loading && !error && (
                <div className={classes.contain}>
                    <div className={classes.back}>
                        <div className={classes.codeSnippet}>
                            &#60; go back to questions /&#62;
                        </div>
                        <Button to='/' onClick={backHandler} color='yellow'>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '1em' }} />
                            Back
                        </Button>
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
                                &#60; write your code here /&#62;
                            </div>
                            <div className={classes.fontSnippet}>
                                &#60; Font Size /&#62;
                            </div>
                            <div className={classes.changeFont}>
                                <input type='number' min={2} max={50} defaultValue={15} onChange={e => setCodeFont(e.target.value)} />
                            </div>

                            <div className={classes.changeLang}>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">Language</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedLang}
                                        defaultValue='CPP'
                                        label="Language"
                                        onChange={e => setSelectedLang(e.target.value)}
                                    >
                                        <MenuItem value={'cpp'}>CPP</MenuItem>
                                        <MenuItem value={'java'}>JAVA</MenuItem>
                                        <MenuItem value={'python'}>PYTHON</MenuItem>
                                        <MenuItem value={'javascript'}>JAVASCRIPT</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className={classes.editorText}>
                                <CodeEditor
                                    onValueChange={onValueChange}
                                    fontSize={codeFont}
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
                            <Button to='/' onClick={submitHandler} color='green'>
                                {codeSubmittingState === 'submitting' ? 'Submitting' : 'Submit'}
                                {codeSubmittingState === 'submitting' && <div className={classes.spin} />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment >
    )
}

export default Question;