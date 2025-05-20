import React from 'react';
import EnterButton from './enter/EnterButton';
import RegistrationForm from './registrationForm/RegistrationForm';
import './RegistrationPage.css';

const RegistrationPage = () => {
    return (
        <div className='registration-page'>
            <div className='left-side'>
                <EnterButton/>
            </div>

            <div className='right-side'>
                <RegistrationForm/>
            </div>
        </div>
    );
};

export default RegistrationPage;