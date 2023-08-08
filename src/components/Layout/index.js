import React from "react";

import {Route, Switch,} from "react-router-dom";
// styles
import useStyles from "./styles";
// pages
import Play from "../../pages/Play";
import NavBar from "../../components/NavBar";
import Profile from "../../pages/Profile";
import Instructions from "../../pages/Instructions";
import Stats from "../../pages/Stats";

export default function Layout(props) {
    var classes = useStyles();

    return (
        <div className={classes.root}>
            <NavBar/>
            <div className={classes.content}>
                <Switch>
                    <Route path="/app/play" component={Play} exact/>
                    <Route path="/app/instructions" component={Instructions} exact/>
                    <Route path="/app/stats" component={Stats} exact/>
                    <Route path="/app/profile" component={Profile} exact/>
                </Switch>
            </div>
        </div>
    );
}