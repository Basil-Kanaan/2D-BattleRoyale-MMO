import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Paper} from '@material-ui/core'
import {useFormik} from 'formik';
import * as yup from 'yup';
import Typography from '../../components/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {AuthContext} from '../../contexts/AuthContext';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress'
import {green} from '@material-ui/core/colors';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

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
        height: 35,
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#55bfbc",
        color: "white",
        "&:hover": {
            backgroundColor: "#39807e"
        }
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -12,
    },
    wrapper: {
        position: 'relative',
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
        fontSize: 43,
        fontWeight: 700, // Roboto Condensed
    }
    ,
    hideBtn: {
        '&:hover': {
            cursor: 'pointer',
        }
    }
}));

function SignIn(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        showPassword: false,
    });
    const [loading, setLoading] = React.useState(false);

    const [open, setOpen] = React.useState(false);
    const {updateAuth, updateToken} = useContext(AuthContext);

    const handleClickShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const timer = React.useRef();

    const handleLogin = (values) => {
        var formBody = [];
        for (var property in values) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(values[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        // fetch('http://localhost:8000/api/user/login', {
        //     method: 'POST',
        //     body: formBody,
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     }
        // }).then(response => response.json()).then(data => {
        //     if (data.message) {
        //         setOpen(true);
        //     } else {
        //         localStorage.setItem("token", data.jwtToken);
        //         updateAuth(true);
        //     }
        // }).catch(err => {
        //     setOpen(true);
        // });
    }


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
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

    return (
        <div>
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
                <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }} open={open} autoHideDuration={1000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        Login Unsuccessful
                    </Alert>
                </Snackbar>
                <Paper variant="outlined" square className={classes.bgPaper}>
                    <div className={classes.paper}>
                        <Typography className={classes.title} variant="h3" gutterBottom marked="center" align="center">
                            SIGN IN
                        </Typography>
                        <form className={classes.form} onSubmit={formik.handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={values.showPassword ? 'text' : 'password'}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {values.showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <FormControlLabel control={<Checkbox value="remember" color="primary"/>}
                                              label="Remember me"/>
                            <div className={classes.wrapper}>
                                <Button href="/#/app" fullWidth variant="contained" type="submit"
                                        className={classes.submit} disabled={loading}>
                                    {loading ? "" : "Login"}
                                </Button>
                                {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                            </div>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/#/forgot-password" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/#/signup" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={8}>
                        <Copyright/>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}

export default (SignIn);