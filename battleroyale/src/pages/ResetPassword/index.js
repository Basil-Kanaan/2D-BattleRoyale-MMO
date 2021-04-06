import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '../../components/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Paper } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
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
};

const validationSchema = yup.object({
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
});

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

function ResetPassword(props) {
    const classes = useStyles();
    const [isVeri, setIsVeri] = useState(false);
    const [confirmPass, setConfirmPass] = useState(false);
    const [open, setOpen] = useState(false);

    const token = props.match.params.token;

    const checkAuth = () => {
        fetch('http://localhost:8000/api/user/verify-password-reset', {
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

    const handleReset = (values) => {

        if (values.confirmpassword !== values.password) {
            setConfirmPass(true);
            return;
        }

        var formBody = [];
        for (var property in values) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(values[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&");
        fetch('http://localhost:8000/api/reset-password', {
            method: 'PUT',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: token
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            if(data) {
                setOpen(true);
            }
        }).catch(err => {

        });
    };


    const formik = useFormik({

        initialValues: {
            password: '',
            confirmpassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleReset(values);
        },
    });

    const handleClosePass = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    
    useEffect(() => {
        checkAuth();
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
                            <Typography className={classes.title} variant="h4" gutterBottom marked="center" align="center">
                                ENTER YOUR NEW PASSWORD BELOW.
                        </Typography>
                            <form className={classes.form} onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            error={confirmPass || formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            name="confirmpassword"
                                            label="Confirm Password"
                                            type="password"
                                            id="confirmpassword"
                                            value={formik.values.confirmpassword}
                                            onChange={formik.handleChange}
                                            error={confirmPass}
                                            helperText={confirmPass ? "Passwords do not match" : ""}
                                        />
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        className={classes.submit}
                                    >
                                        Reset Password
                            </Button>
                                </Grid>
                            </form>
                        </div>
                        <Box mt={8}>
                            <Copyright />
                        </Box>
                    </Paper>
                </Container>
            </div>
        );
    }
    else {
        return null;
    }
}

export default ResetPassword;