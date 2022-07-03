import useInput from '../../hooks/use-input';

const isNotEmpty = (value) => value.trim() !== '';
const isEmail = (value) => value.includes('@');

const BasicForm = props => {
    const { onFormSubmitted } = props;

    const {
        value: firstNameValue,
        isValid: firstNameIsValid,
        hasError: firstNameHasError,
        valueChangeHandler: firstNameChangeHandler,
        inputBlurHandler: firstNameBlurHandler,
        reset: resetFirstName,
    } = useInput(isNotEmpty);
    const {
        value: passwordValue,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPassword,
    } = useInput(isNotEmpty);
    const {
        value: emailValue,
        isValid: emailIsValid,
        hasError: emailHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail,
    } = useInput(isEmail);

    let formIsValid = false;

    if (firstNameIsValid && passwordIsValid && emailIsValid) {
        formIsValid = true;
    }

    const submitHandler = event => {
        event.preventDefault();

        if (!formIsValid) {
            return;
        }

        console.log('Submitted!');
        onFormSubmitted(firstNameValue, emailValue, passwordValue);

        resetFirstName();
        resetPassword();
        resetEmail();
    };

    const firstNameClasses = firstNameHasError ? 'form-control invalid' : 'form-control';
    const passwordClasses = passwordHasError ? 'form-control invalid' : 'form-control';
    const emailClasses = emailHasError ? 'form-control invalid' : 'form-control';

    return (
        <form onSubmit={submitHandler}>
            <div className='control-group'>
                <div className={firstNameClasses}>
                    <label htmlFor='name'>Name</label>
                    <input
                        type='text'
                        id='name'
                        value={firstNameValue}
                        onChange={firstNameChangeHandler}
                        onBlur={firstNameBlurHandler}
                    />
                    {firstNameHasError && <p className="error-text">Please enter a Name.</p>}
                </div>
                <div className={emailClasses}>
                    <label htmlFor='name'>E-Mail Address</label>
                    <input
                        type='text'
                        id='name'
                        value={emailValue}
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                    />
                    {emailHasError && <p className="error-text">Please enter a valid email address.</p>}
                </div>
            </div>

            <div className={passwordClasses}>
                <label htmlFor='password'>Password</label>
                <input
                    type='text'
                    id='password'
                    value={passwordValue}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                />
                {passwordHasError && <p className="error-text">Please enter a Password.</p>}
            </div>
            <div className='form-actions'>
                <button disabled={!formIsValid}>Submit</button>
            </div>
        </form>
    );
};

export default BasicForm;
