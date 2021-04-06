import React, {useContext, useEffect, useState} from "react";
import {Button, Grid} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import {AuthContext} from '../../contexts/AuthContext';
// styles
import useStyles from "./styles";
// components
import Chart from "react-google-charts";

import HelloImg from "../../assets/hello.svg";

import Snackbar from '@material-ui/core/Snackbar';

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Dashboard(props) {
    var classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [email, setEmail] = React.useState('');
    const [list, setList] = React.useState([]);
    const [upcomingBills, setUpcomingBills] = React.useState([]);
    const [internet, setInternet] = React.useState(0);
    const [food, setFood] = React.useState(0);
    const [electricity, setElectricity] = React.useState(0);
    const [phone, setPhone] = React.useState(0);
    const [water, setWater] = React.useState(0);
    const [utilities, setUtilities] = React.useState(0);
    const [other, setOther] = React.useState(0);
    const [sixInternet, setSixInternet] = React.useState([0, 0, 0, 0, 0, 0]);
    const [sixPhone, setSixPhone] = React.useState([0, 0, 0, 0, 0, 0]);
    const [sixFood, setSixFood] = React.useState([0, 0, 0, 0, 0, 0]);
    const [sixUtilities, setSixUtilities] = React.useState([0, 0, 0, 0, 0, 0]);
    const [lastSixMonths, setLastSixMonths] = React.useState(['', '', '', '', '', '']);
    const [value, setValue] = React.useState("");
    const [billCount, setBillCount] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const {isAuth, updateAuth, updateToken} = useContext(AuthContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const checkAuth = () => {
        fetch('http://localhost:8000/api/user/verify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            if (data !== true) {
                window.location.href = "/";
            }
        }).catch(err => {
            console.log("Error");
        });
    }

    const getUserInfo = () => {
        fetch('http://localhost:8000/api/user/profile', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            setValue(data.firstName);
            setEmail(data.email);
            getBillStatus(data.email);
            getPieData();
            getTrendData();
            getLastSixMonths();
            getUpcomingBills();
        }).catch(err => {
            console.log("Error");
        });
    }

    
    const getBillStatus = (email) => {
        console.log("EMAI"+email);
        var formBody = [];
        var encodedKey = encodeURIComponent("email");
        var encodedValue = encodeURIComponent(email);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody = formBody.join("&");
        fetch('http://localhost:8000/api/user/bill', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then(response => response.json()).then(data => {
            console.log(data.length);
            setList(data);
            setBillCount(data.length);
        }).catch(err => {
            alert(err);
        });
    }

    const getLastSixMonths = () => {
        var d = new Date();
        var m = d.getMonth();
        var months = new Array();
        months[0] = "Jan";
        months[1] = "Feb";
        months[2] = "Mar";
        months[3] = "Apr";
        months[4] = "May";
        months[5] = "Jun";
        months[6] = "Jul";
        months[7] = "Aug";
        months[8] = "Sep";
        months[9] = "Oct";
        months[10] = "Nov";
        months[11] = "Dec";

        var i;
        for (i = 1; i < 7; i++) {
            lastSixMonths[i-1] = months[(m-i+12)%12];
        }
    }

    const getPieData = () => {
        var d = new Date();
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        var lastMonth = (d.getMonth() + 12) % 12;
        var n = month[lastMonth];
        
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].month == n) {
                if (list[i].type == 'Internet') {
                    setInternet(internet + list[i].billamt);
                } else if (list[i].type == 'Food') {
                    setFood(food + list[i].billamt);
                } else if (list[i].type == 'Electricity') {
                    setElectricity(electricity + list[i].billamt);
                } else if (list[i].type == 'Phone') {
                    setPhone(phone + list[i].billamt);
                } else if (list[i].type == 'Water') {
                    setWater(water + list[i].billamt);
                } else if (list[i].type == 'Utilities') {
                    setUtilities(utilities + list[i].billamt);
                } else if (list[i].type == 'Other') {
                    setOther(other + list[i].billamt);
                }
            }
        }
    }

    const getTrendData = () => {
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        var today = new Date();
        var month = today.getMonth();
        
        var h = 0;
        var i;
        for (i = (month+6); i < month+12; i++) {
            var j = i;
            if (j > 11) {
                j = j%12;
            }
            var k;
            for (k = 0; k < list.length; k++) {
                if (list[k].month == month[j] && list[k].type == 'Internet') {
                    sixInternet[h] = list[k].billamt;
                } else if (list[k].month == month[j] && list[k].type == 'Food') {
                    sixFood[h] = list[k].billamt;
                } else if (list[k].month == month[j] && list[k].type == 'Phone') {
                    sixPhone[h] = list[k].billamt;
                } else if (list[k].month == month[j] && list[k].type == 'Utilities') {
                    sixUtilities[h] = list[k].billamt;
                } 
            }
            h++;
        }
    }

    // gets monthly and yearly bills that are scheduled in the next 7 days
    const getUpcomingBills = () => {
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        var upcoming = new Array();
        var i;
        for (i = 0; i < list.length; i++) {
            var billDate = new Date();
            if (list[i].val == 'Monthly') {
                billDate.setDate(list[i].day);
            } else if (list[i].val == 'Yearly') {
                billDate.setDate(list[i].day);
                billDate.setMonth(list[i].month);
            } else {
                billDate.setDate(today.getDate()-1);
            }
            if (billDate > today && billDate <= nextWeek) {
                upcoming.push(list[i]);
            }
        }
        setUpcomingBills(upcoming);
    }

    useEffect(() => {
        getUserInfo();
        checkAuth();
    }, []);

    return (
        <div className={classes.cardGrid}>
            <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} open={open} autoHideDuration={1000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Login successful
                </Alert>
            </Snackbar>
            <div className={classes.main_greeting}>
                <img src={HelloImg} className={classes.hello_img} alt=""/>
                <div style={{flex: 1, flexDirection: "row"}}>
                    <Typography className={classes.main_greeting_h1} variant="h1">Hello {value} </Typography>
                    <Typography className={classes.main_greeting_p}>Welcome to your dashboard</Typography>
                </div>
            </div>
            <Grid container spacing={2}>
                <Grid item lg={3}
                      sm={6}
                      xl={3}
                      xs={12}>
                    <Paper className={classes.card} variant="outlined">
                        <CardActions>
                            <div className={classes.inner}>
                                <Typography noWrap variant="h6" size="small">Total Bills</Typography>
                                <Typography noWrap style={{position: 'relative', bottom: -80, right: 90}} variant="h2"
                                            size="small">{billCount}</Typography>
                            </div>
                        </CardActions>
                    </Paper>
                </Grid>
                <Grid item lg={3}
                      sm={6}
                      xl={3}
                      xs={12}>
                    <Paper className={classes.card} variant="outlined">
                        <CardActions>
                            <div className={classes.inner}>
                                <Typography variant="h6" size="small">Total Reviews</Typography>
                                <Typography style={{position: 'relative', bottom: -80, right: 120}} variant="h2"
                                            size="small">666</Typography>
                            </div>
                        </CardActions>
                    </Paper>
                </Grid>
                <Grid item lg={6}
                      sm={12}
                      xl={6}
                      xs={12}>
                    <Paper className={classes.card} variant="outlined">
                        <CardActions>
                            <Typography noWrap variant="h6" size="small">Upcoming Bills</Typography>
                        </CardActions>
                        <table>
                            <tr>
                                <th>Name</th>
                                <th>Due on</th>
                                <th>Amount Due</th>
                            </tr>
                            {upcomingBills.map((item) => (
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{item.month + " " + item.day}</td>
                                    <td>{item.billamt}</td>
                                </tr>
                            ))}
                        </table>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                    <Paper className={classes.bottomCards} variant="outlined">
                        <CardActions>
                            <Typography variant="h6" size="small">Expected Total</Typography>
                            <Button color="primary" variant="contained" style={{textTransform: 'none'}}>Monthly</Button>
                            <Typography id="expectedTotal" variant="h6" size="small"
                                        className={classes.expectedTotal}>$666</Typography>
                        </CardActions>

                        <Chart
                            width={'100%'}
                            height={'95%'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Category', 'in dollars (CAD)'],
                                ['Utilities', utilities],
                                ['Food', food],
                                ['Internet', internet],
                                ['Mobile Phone', phone],
                                ['Electricity', electricity],
                                ['Water', water],
                                ['Other', other]
                            ]}
                            rootProps={{'data-testid': '2'}}
                            options={{
                                tooltip: {
                                    backgroundColor: "transparent",
                                }
                                // tooltip: { format: { value: function (value, ratio, id) { return value; } } }
                            }}
                        />
                    </Paper>
                </Grid>
                {/*<Grid item xs={12} sm={12} md={6}>*/}
                {/*    <Paper className={classes.bottomCards} variant="outlined">*/}
                {/*        <CardActions>*/}
                {/*            <Typography variant="h6" size="small">Goals</Typography>*/}
                {/*        </CardActions>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}
                <Grid item xs={12} sm={12} md={6}>
                    <Paper className={classes.bottomCards} variant="outlined">
                        <CardActions>
                            <Typography variant="h6" size="small">Expenses in the last 6 months</Typography>
                        </CardActions>

                        <Chart
                            width={'100%'}
                            height={'95%'}
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={[
                                [
                                    'Months',
                                    'Utilities',
                                    'Food',
                                    'Internet',
                                    'Mobile Phone'
                                ],
                                [lastSixMonths[0], sixUtilities[5], sixFood[5], sixInternet[5], sixPhone[5]],
                                [lastSixMonths[1], sixUtilities[4], sixFood[4], sixInternet[4], sixPhone[4]],
                                [lastSixMonths[2], sixUtilities[3], sixFood[3], sixInternet[3], sixPhone[3]],
                                [lastSixMonths[3], sixUtilities[2], sixFood[2], sixInternet[2], sixPhone[2]],
                                [lastSixMonths[4], sixUtilities[1], sixFood[1], sixInternet[1], sixPhone[1]],
                                [lastSixMonths[5], sixUtilities[0], sixFood[0], sixInternet[0], sixPhone[0]]
                            ]}
                            rootProps={{'data-testid': '3'}}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
