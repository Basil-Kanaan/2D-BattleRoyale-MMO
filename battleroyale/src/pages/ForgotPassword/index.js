import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '../../components/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Paper } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
});


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
        marginTop: theme.spacing(1),
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
        fontSize: 35,
        fontWeight: 700, // Roboto Condensed
    },
    hideBtn: {
        '&:hover': {
            cursor: 'pointer',
        }
    }
}));

function ForgotPassword(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleResetLink = (values) => {

        var formBody = [];
        for (var property in values) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(values[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&");
        fetch('http://localhost:8000/api/forgot-password', {
            method: 'PUT',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
        }).catch(err => {
            setOpen(true);
        });
    };

    const handleClosePass = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const formik = useFormik({

        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleResetLink(values);
        },
    });

    return (
        <div>
            <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} open={open} autoHideDuration={1000} onClose={handleClosePass}>
                <Alert onClose={handleClosePass} severity="success">
                    Password Reset Link Sent!
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
                            FORGOT YOUR PASSWORD?
                        </Typography>
                        <Typography variant="body2" align="center">
                            {"Enter your email address below and we'll " +
                                'send you a link to reset your password.'}
                        </Typography>
                        <form className={classes.form} onSubmit={formik.handleSubmit}>
                            <TextField
                                variant="standard"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <Button fullWidth type="submit" variant="contained" color="secondary" className={classes.submit}>
                                SEND RESET LINK
                            </Button>
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

export default ForgotPassword;