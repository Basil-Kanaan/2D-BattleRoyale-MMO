import React, {useContext, useEffect} from "react";
import {Button, Grid} from "@material-ui/core";
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {AuthContext} from '../../contexts/AuthContext';
// styles
import useStyles from "./styles";
// components

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function createData(name, score) {
    return { name, score };
  }




const rows = [
    createData( 'Player', 159),
    createData( 'Player', 237),
    createData( 'Player', 262),
    createData( 'Player', 305),
    createData( 'Player', 356),
    createData('Player', 159),
    createData( 'Player', 237),
    createData('Player', 262),
    createData('Player', 305),
    createData('Player', 356),
  ];

export default function Stats(props) {
    var classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [email, setEmail] = React.useState('');
    const [list, setList] = React.useState([]);
    const [value, setValue] = React.useState("");
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
        }).catch(err => {
            alert(err);
        });
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
            
                <TableContainer className={classes.usercontainer} component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell className={classes.head}>User</TableCell>
                            <TableCell className={classes.head} align="center">Score</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        <TableCell > User </TableCell>
                        <TableCell > 1000 </TableCell>
                        </TableBody>
                    </Table>
           
                 </TableContainer> 
                    <TableContainer className={classes.container} component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell className={classes.head}>Top 10 Leaderboard</TableCell>
                                <TableCell className={classes.head} align="center">Score</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name} 
                                </TableCell>
                                <TableCell align="center">{row.score}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                
            
            

        </div>
    );
}
