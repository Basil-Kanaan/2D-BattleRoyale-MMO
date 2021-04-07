import React, {useContext, useEffect} from "react";
import {Button, Grid} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import {AuthContext} from '../../contexts/AuthContext';
// styles
import useStyles from "./styles";
// components

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Instructions(props) {
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

    useEffect(() => {
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
