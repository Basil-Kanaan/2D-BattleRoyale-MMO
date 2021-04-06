import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '../../components/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Paper} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © BillTracker 2021. '}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    bgPaper: {
        marginTop: theme.spacing(15),
        padding: 20,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#55bfbc",
        color: "white",
        "&:hover": {
            backgroundColor: "#39807e"
        }
    },
    navbar: {
        color: '#EDF2F4',
        backgroundColor: '#2B2D42',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
    },
    navtitle: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: '5%',
    },

    navbuttons: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 25,
        fontWeight: 700, // Roboto Condensed
    },
    hideBtn: {
        '&:hover': {
            cursor: 'pointer',
        }
    }
}));


function Verification(props) {
    const classes = useStyles();
    const [isVeri, setIsVeri] = useState(true);
    const [open, setOpen] = useState(false);

    const token = props.match.params.token;


    const handleClosePass = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const verifyuser =() =>{
        fetch('http://localhost:8000/api/account-verification', {
            method: 'PUT',
            headers: {
                jwt_token: token
            }
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                setIsVeri(true);
            }
        }).catch(err => {
            console.log(err);
        });
    }
    useEffect(() => {
        verifyuser();
    }, []);

    if (isVeri) {
        return (
            <div>
                <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }} open={open} autoHideDuration={1000} onClose={handleClosePass}>
                    <Alert onClose={handleClosePass} severity="success">
                        Password Reset!
                    </Alert>
                </Snackbar>
                <AppBar position="static" className={classes.navbar}>
                    <Toolbar className={classes.navtitle}>
                        <Typography className={classes.hideBtn} onClick={() => {
                            window.location.href = '/';
                        }} variant="h6">BillTracker</Typography>
                        <div className={classes.navbuttons}>
                            <Button color="inherit" onClick={() => {
                                window.location.href = '/';
                            }}>
                                About
                            </Button>
                            <Button color="inherit" onClick={() => {
                                window.location.href = '/#/Login';
                            }}>Login</Button>
                            <Button color="inherit" onClick={() => {
                                window.location.href = '/#/signup';
                            }}>Sign Up</Button>
                        </div>

                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="sm">
                    <Paper variant="outlined" square className={classes.bgPaper}>
                        <div className={classes.paper}>
                            <Typography className={classes.title} variant="h4" gutterBottom marked="center"
                                        align="center">
                                Account Successfully Verified.
                            </Typography>
                        </div>
                        <Box mt={8}>
                            <Copyright/>
                        </Box>
                    </Paper>
                </Container>
            </div>
        );
    } else {
        return null;
    }
}


export default Verification;