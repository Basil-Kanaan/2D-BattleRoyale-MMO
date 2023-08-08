import React, {useContext, useEffect} from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
// components
import Layout from "./components/Layout";
// import Login from "./pages/Login";
import Landing from './pages/Landing';
import Register from './pages/Register';

import {makeStyles} from "@material-ui/core";
import {AuthContext} from './contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: "lightgray",
        float: "bottom",
        padding: "20px",
    },
}));

export default function App() {
    // global
    // const classes = useStyles();
    const {isAuth, updateAuth, updateToken, token} = useContext(AuthContext);

    const checkAuthenticated = () => {
        fetch('http://localhost:8000/api/user/verify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            data === true ? updateAuth(true) : updateAuth(false);
        }).catch(err => {
            console.log("Error");
        });
    };
    useEffect(() => {
        //checkAuthenticated();
    }, []);

    return (
        <div className="App">
            <Switch>
                <Route path="/" render={() => !isAuth ? (<Landing/>) : (<Redirect to="/app"/>)} exact/>
                {/* <Route path="/login" render={() => <Login/>} exact/> */}
                <Route path="/app" component={Layout}/>
                <Route path="/register" render={() => !isAuth ? (<Register/>) : (<Redirect to="/app"/>)}/>

                <Route path='*'>
                    <div>Not Found</div>
                </Route>
            </Switch>
        </div>
    );
}
