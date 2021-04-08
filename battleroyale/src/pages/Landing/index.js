import React, { useContext, useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AuthContext } from '../../contexts/AuthContext';
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const validationSchema = yup.object({
    username: yup
        .string('Enter your username')
        .min(6, 'Username should be of minimum 6 characters length')
        .required('Username is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
});

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        backgroundImage: 'url(https://wallpapercave.com/wp/wp6308454.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    about: {
        height: '80vh',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -12,
    },
    navbar: {
        color: '#FBFAF8',
        backgroundColor: '#0A122A',
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

    const handleLogin = (values) => {

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
            username: '',
            password: '',
           
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            timer.current = window.setTimeout(() => {
                setLoading(false);
                handleLogin(values);
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
                                    window.location.href = '/#/register';
                                }}>Register</Button>
                            </div>
                        </Toolbar>
                    </AppBar>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h1" className={classes.slogan}><b>
                        Login to Battle Royale</b>
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Card className={classes.card}>

                        <Typography align="center" component="h1" variant="h4">Login</Typography>

                        <hr border="1px solid gray" height="1px" width="60%" color="#dbdbdb" />

                        <form className={classes.form} onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        error={formik.touched.username && Boolean(formik.errors.username)}
                                        helperText={formik.touched.username && formik.errors.username}
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

                            </Grid>
                            <div className={classes.wrapper}>
                                <Button fullWidth variant="contained" type="submit"
                                    className={classes.submit} disabled={loading}>
                                    {loading ? "" : "Login"}
                                </Button>
                                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                        </form>

                        <Grid container justify="center">
                            <Grid item>
                                <Link href="/#/register" variant="body2">
                                    Don't have an account? Register
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