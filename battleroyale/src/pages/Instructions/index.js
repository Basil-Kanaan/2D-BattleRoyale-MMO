import React, {useContext, useEffect} from "react";
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
    };

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
    };


    const getBillStatus = (email) => {
        console.log("EMAI" + email);
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
    };

    const getLastSixMonths = () => {
        var d = new Date();
        var m = d.getMonth();
        var months = [];
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
            lastSixMonths[i - 1] = months[(m - i + 12) % 12];
        }
    };

    const getPieData = () => {
        var d = new Date();
        var month = [];
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
    };

    const getTrendData = () => {
        var month = [];
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
        for (i = (month + 6); i < month + 12; i++) {
            var j = i;
            if (j > 11) {
                j = j % 12;
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
    };

    // gets monthly and yearly bills that are scheduled in the next 7 days
    const getUpcomingBills = () => {
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        var upcoming = [];
        var i;
        for (i = 0; i < list.length; i++) {
            var billDate = new Date();
            if (list[i].val == 'Monthly') {
                billDate.setDate(list[i].day);
            } else if (list[i].val == 'Yearly') {
                billDate.setDate(list[i].day);
                billDate.setMonth(list[i].month);
            } else {
                billDate.setDate(today.getDate() - 1);
            }
            if (billDate > today && billDate <= nextWeek) {
                upcoming.push(list[i]);
            }
        }
        setUpcomingBills(upcoming);
    };

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
            <Grid >
                <Grid xs={12}>
                    <Paper className={classes.card} variant="outlined">
                       <Typography className={classes.cardTitle} variant="h6" size="small">Instructions</Typography>
                        
                        <ul>
                            <li>
                                Use WASD to move the player
                            </li>
                            <li>
                                Use cursor to point the turret and left click to shoot
                            </li>
                            <li>
                                Move around to pick up different ammo packs
                            </li>
                            <li>
                                Each quadrant represents a terrain:
                                <ul>
                                    <li>
                                        Nether(Purple): All players take more damage
                                    </li>
                                    <li>
                                        Ice(Blue): Player can move faster
                                    </li>
                                    <li>
                                        Sand(Yellow): Player moves slower
                                    </li>
                                    <li>
                                        Grass(Green): Player moves normally
                                    </li>
                                </ul>
                            </li>
                            <li>
                                3 Different AI
                            </li>
                            <li>
                                Score by killing the AI
                            </li>
                            <li>
                                Multiple weapons (Cannon, Pistol, Shotgun)
                            </li>
                            <li>
                                Use space bar to switch between weapons
                            </li>
                            <li>
                                Change the difficulty by clicking on one of the options
                            </li>
                            <li>
                                Restart the game by clicking the play again button at the bottom
                            </li>
                            <li>
                                Try to last as long as you can!
                            </li>
                        </ul>
                    </Paper>
                </Grid>
                
                
            </Grid>
        </div>
    );
}
