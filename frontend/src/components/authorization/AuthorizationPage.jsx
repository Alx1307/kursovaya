import React from 'react';
import RegistrationButton from './registration/registrationButton';
import EnterForm from './enterForm/EnterForm';
import './AuthorizationPage.css';

const AuthorizationPage = () => {
    return (
        <div className='authorization-page'>
            <div className='left-auth-side'>
                <EnterForm/>
            </div>

            <div className='right-auth-side'>
                <RegistrationButton/>
            </div>
        </div>
    );
};

export default AuthorizationPage;