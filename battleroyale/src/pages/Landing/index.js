import React, { useContext, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import mainLogo from './form_icon.png';
import { AuthContext } from '../../contexts/AuthContext';
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors';

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
});

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    about: {
        height: '80vh',
    },

    about2: {
        height: '80vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: "center",
        backgroundSize: "100%"
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -12,
    },
    navbar: {
        color: '#0A122A',
        backgroundColor: '#698F3F',
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

    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: "30px",
        marginRight: "35%"
    },

    submit: {
        height: 35,
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#55bfbc",
        color: "white",
        "&:hover": {
            backgroundColor: "#39807e"
        }
    },

    card: {
        float: "right",
        padding: '30px',
        maxWidth: "400px",
        marginRight: "35%",

    },
    wrapper: {
        position: 'relative',
    },
    slogan: {
        fontFamily: "Poppins",
        color: "white",
        alignItems: "center",
        justify: "center",
        marginTop: "10%",
        marginLeft: "35%",
        width: "450px"
    },

    aboutmsg: {
        fontFamily: "Poppins",
        marginTop: "10%",
        marginLeft: "35%",
        margin: "50px",
        fontSize: "10",
        width: "500px"
    },

    abouth1: {
        marginTop: "5%",
        marginLeft: "35%",

    },

    abouth2: {
        marginTop: "10%",
        marginLeft: "10%",
        justify: "right",

    },

    aboutmsg2: {
        fontFamily: "Poppins",
        marginTop: "10%",
        marginLeft: "10%",
        justify: "right",
        fontSize: "10",
        width: "500px"

    },

    footer: {
        backgroundColor: "lightgray",
        float: "bottom",
        padding: "20px",
    },

    team: {
        fontFamily: "Poppins",
        margin: "50px",
        fontSize: "10",
    },
    signup: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#55bfbc",
        color: "white",
        "&:hover": {
            backgroundColor: "#39807e"
        },
        marginLeft: "10%",
        justify: "right",
        width: "150px",
        height: "50px",
        fontSize: "18px",
    },
    subimage: {
        marginTop: "15%",
        marginLeft: "10%",
        justify: "right",
        width: "700px"
    },
    hideBtn: {
        '&:hover': {
            cursor: 'pointer',
        }
    }
}));


function Landing() {
    const classes = useStyles();

    const timer = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const { updateAuth, updateToken } = useContext(AuthContext);
    const [confirmPass, setConfirmPass] = React.useState(false);

    const handleRegister = (values) => {

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
        fetch('http://localhost:8000/api/user/register', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            if (data.message) {
                setOpen(true);
            } else {
                localStorage.setItem("token", data.jwtToken);
                updateAuth(true);
            }
        }).catch(err => {
            setOpen(true);
        });
    };

    const formik = useFormik({

        initialValues: {
            email: '',
            password: '',
            confirmpassword: '',
            firstName: '',
            lastName: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            timer.current = window.setTimeout(() => {
                setLoading(false);
                handleRegister(values);
            }, 2000);
        },
    });
    const myRef = useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView();
    return (
        <div>
            <Grid container component="main" className={classes.root}>
                {/*<CssBaseline/>*/}
                <Grid item xs={12}>
                    <AppBar position="static" className={classes.navbar}>
                        <Toolbar className={classes.navtitle}>
                            <Typography className={classes.hideBtn} onClick={() => {
                                window.location.href = '/';
                            }} variant="h6">Battle Royale</Typography>
                            <div className={classes.navbuttons}>
                                <Button color="inherit" onClick={executeScroll}>
                                    About
                                </Button>
                                <Button color="inherit" onClick={() => {
                                    window.location.href = '/#/Login';
                                }}>Login</Button>
                                <Button color="inherit" onClick={() => {
                                    window.location.href = '/#/signup';
                                }}>Register</Button>
                            </div>

                        </Toolbar>
                    </AppBar>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h1" className={classes.slogan}><b>
                        New to Battle Royale?</b>
                    </Typography>
                </Grid>

                <Grid item xs={6}>

                    <Card className={classes.card}>

                        <img align={"right"} height="40px" width="40px" src={mainLogo} alt="" />

                        <Typography align="center" component="h1" variant="h4">Sign Up</Typography>

                        <hr border="1px solid gray" height="1px" width="60%" color="#dbdbdb" />

                        <form className={classes.form} onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                        autoFocus

                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
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
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={confirmPass || formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                    />
                                </Grid>
                                <Grid item xs={12}>
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

                            </Grid>
                            <div className={classes.wrapper}>
                                <Button fullWidth variant="contained" type="submit"
                                    className={classes.submit} disabled={loading}>
                                    {loading ? "" : "Sign Up"}
                                </Button>
                                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                        </form>

                        <Grid container justify="center">
                            <Grid item>
                                <Link href="/#/Login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

            </Grid>

            <div ref={myRef} id="About" className={classes.about}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="h3" className={classes.abouth1}>
                            <b>About Battle Royale</b>
                        </Typography>

                        <Typography variant="h5" className={classes.aboutmsg}>
                            Battle Royale is an MMOG<br /><br />
                            This game includes players, AI, obstacles and a whole world to move around in.<br /><br />
                            You need to survive as long as you can without dying, killing other players and AI to win.
                            Can you survive the longest? <br /><br />
                        </Typography>


                    </Grid>
                    <Grid item xs={6}>
                               <img
                                src={'https://ychef.files.bbci.co.uk/976x549/p091j3dx.jpg'}
                                className={classes.subimage} />
                       
                    </Grid>

                </Grid>

            </div>

        
        </div>
    );
}

export default (Landing);