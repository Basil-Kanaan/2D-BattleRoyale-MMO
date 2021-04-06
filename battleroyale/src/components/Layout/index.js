import React from "react";
import classnames from "classnames";

import {Route, Switch,} from "react-router-dom";
// styles
import useStyles from "./styles";
// pages
import Dashboard from "../../pages/Dashboard";
import NavBar from "../../pages/Navbar";
import MyBills from "../../pages/MyBills";
import Profile from "../../pages/Profile";
import Compare from "../../pages/BillCompare";

export default function Layout(props) {
    var classes = useStyles();

    return (
        <div className={classes.root}>
            <NavBar/>
            <div
                className={classnames(classes.content)}
            >
                <div className={classes.Title}/>
                <Switch>
                    <Route path="/app" component={Dashboard} exact/>
                    <Route path="/app/mybills" component={MyBills} exact/>
                    <Route path="/app/profile" component={Profile} exact/>
                    <Route path="/app/compare" component={Compare} exact/>
                </Switch>
            </div>
        </div>
    );
}