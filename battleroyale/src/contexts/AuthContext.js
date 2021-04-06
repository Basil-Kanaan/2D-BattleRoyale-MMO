import React, {createContext, useState} from 'react';

const AuthContext = createContext();

function AuthContextProvider(props) {
    const [auth, setAuth] = useState(false);
    const [token, setToken] = useState('');

    function updateAuth(value) {
        setAuth(value);
    }

    function updateToken(value) {
        setToken(value);
    }

    return (
        <AuthContext.Provider value={{isAuth: auth, updateAuth: updateAuth, token: token, updateToken: updateToken}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export {
    AuthContextProvider,
    AuthContext
};