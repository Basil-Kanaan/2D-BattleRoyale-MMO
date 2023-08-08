import React, {useContext, useEffect} from "react";
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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// components

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function createData(name, score) {
    return {name, score};
}


const rows = [
    createData('Player1', 159),
    createData('Player2', 237),
    createData('Player3', 262),
    createData('Player4', 305),
    createData('Player5', 356),
    createData('Player6', 159),
    createData('Player7', 237),
    createData('Player8', 262),
    createData('Player9', 305),
    createData('Player0', 356),
];

export default function Stats(props) {
    var classes = useStyles();
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
                        {list.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.user}</TableCell>
                                <TableCell>{item.score}</TableCell>
                            </TableRow>
                        ))}
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
