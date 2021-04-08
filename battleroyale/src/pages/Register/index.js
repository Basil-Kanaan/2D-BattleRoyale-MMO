import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '../../components/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Paper} from '@material-ui/core'
import {useFormik} from 'formik';
import * as yup from 'yup';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {AuthContext} from "../../contexts/AuthContext";
import CircularProgress from '@material-ui/core/CircularProgress'
import {green} from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(5),
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
    title: {
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 43,
        fontWeight: 700, // Roboto Condensed
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
    hideBtn: {
        '&:hover': {
            cursor: 'pointer',
        }
    }
}));

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


function SignUp(props) {
    const classes = useStyles();

    const timer = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const {updateAuth, updateToken} = useContext(AuthContext);
    const [confirmPass, setConfirmPass] = React.useState(false);
    const [values, setValues] = React.useState({showPassword: false,});
    const [value, setValue] = React.useState('');

    const [box, setBox] = React.useState({
        Morning: false,
        Afternoon: false,
        Night: false,
    });
    const {Morning, Afternoon, Night} = box;

    const handleRadioGroupChange = (event) => {
        setValue((event.target).value);
    };

    const handleCheckBtnChange = (event) => {
        setBox({...box, [event.target.value]: event.target.checked});
    };


    const handleClickShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
    return (
        <div>
            <AppBar position="static" className={classes.navbar}>
                <Toolbar className={classes.navtitle}>
                    <Typography className={classes.hideBtn} onClick={() => {
                        window.location.href = '/';
                    }} variant="h6">Battle Royale</Typography>
                    <div className={classes.navbuttons}>
                        <Button color="inherit" onClick={() => {
                            window.location.href = '/#/#About';
                        }}> About </Button>
                        <Button color="inherit" onClick={() => {
                            window.location.href = '/#/register';
                        }}>Register</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="sm">
                <Paper variant="outlined" square className={classes.bgPaper}>
                    <div className={classes.paper}>

                        <Typography className={classes.title} variant="h3" gutterBottom marked="center" align="center">
                            SIGN UP
                        </Typography>

                        <form className={classes.form} onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Username"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={confirmPass || formik.touched.password && Boolean(formik.errors.password)}
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

                                <Typography variant='overline'>
                                    Please select your Birthday:
                                </Typography>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="date"
                                        label="Birthday"
                                        type="date"
                                        defaultValue="YYYY-MM-DD"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>

                                <Typography variant='overline'>
                                    Choose your skill level:
                                </Typography>

                                <Grid item xs={12}>
                                    <RadioGroup aria-label="day" name="days" value={value}
                                                onChange={handleRadioGroupChange}>
                                        <FormControlLabel value="Beginner" control={<Radio/>} label="Beginner"/>
                                        <FormControlLabel value="Intermediate" control={<Radio/>} label="Intermediate"/>
                                        <FormControlLabel value="Advanced" control={<Radio/>} label="Advanced"/>
                                    </RadioGroup>
                                </Grid>

                                <Typography variant='overline'>
                                    Choose when you are going to play:
                                </Typography>

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={Morning} onChange={handleCheckBtnChange}
                                                      value="Morning"/>
                                        }
                                        label="Morning"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={Afternoon} onChange={handleCheckBtnChange}
                                                      value="Afternoon"/>
                                        }
                                        label="Afternoon"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={Night} onChange={handleCheckBtnChange} value="Night"/>
                                        }
                                        label="Night"
                                    />
                                </Grid>

                            </Grid>
                            <div className={classes.wrapper}>
                                <Button fullWidth variant="contained" type="submit"
                                        className={classes.submit} disabled={loading}>
                                    {loading ? "" : "Register"}
                                </Button>
                                {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                            </div>
                            <Grid container justify="center">
                                <Grid item>
                                    <Link href="/" variant="body2">
                                        Already have an account? Log in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>

                </Paper>
            </Container>
        </div>
    );
}

export default SignUp;