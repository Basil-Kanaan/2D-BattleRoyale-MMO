import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '../../components/Typography';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import useStyles from './styles';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const validationSchema = yup.object({
    username: yup
        .string('Enter your username')
        .min(6, 'Username should be of minimum 6 characters length')
        .required('Username is required'),
    password: yup
        .string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required'),
    // birthday: yup
    //     .date()
    //     .required('Please enter your birthdate')
    //     .nullable()
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
    const [noSkill, setNoSkill] = React.useState(false);
    const [noRadio, setNoRadio] = React.useState(false);
    //const { setFieldValue } = useFormikContext();
    //const [field] = useField(props);
    //close all snackbars
    function handlecloseSnack() {
        setNoSkill(false);
        setNoRadio(false);
    }

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
        // console.log("user is: " + values.username);
        // console.log("confirm is: " + values.confirmpassword);
        // console.log("pass is: " + values.password);
        //console.log("birth is: " + values.birthday);

        if (values.confirmpassword !== values.password) {
            setConfirmPass(true);
            return;
        }
        if (box.Morning === false && box.Afternoon == false && box.Night == false) {
            setNoSkill(true);
            return;
        }
        if (value == '') {
            setNoRadio(true);
            return;
        }

        var checkboxes = [];
        if (box.Morning == true) checkboxes.push("Morning");
        if (box.Afternoon == true) checkboxes.push("Afternoon");
        if (box.Night == true) checkboxes.push("Night");

        //console.log("radiobtn: " + value);
        //console.log("boxes clicked: " + checkboxes);
        var formBody = {
            username: values.username,
            confirm: values.confirmpassword,
            password: values.password,
            birthday: '2021-04-08',
            day: checkboxes,
            skill: value,
        };
        // for (var property in values) {
        //     var encodedKey = encodeURIComponent(property);
        //     var encodedValue = encodeURIComponent(values[property]);
        //     formBody.push(encodedKey + "=" + encodedValue);
        // }
        // formBody = formBody.join("&");
        fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            body: JSON.stringify(formBody),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            console.log("done");
            // if (data.message) {
            //     setOpen(true);
            // } else {
            //     localStorage.setItem("token", data.jwtToken);
            //     updateAuth(true);
            // }
        }).catch(err => {
            //setOpen(true);
            console.log("error catch");
        });
    };

    const formik = useFormik({

        initialValues: {
            username: '',
            password: '',
            confirmpassword: '',
            birthday: null,
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

                        <form id="regForm" className={classes.form} onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        error={formik.touched.username && Boolean(formik.errors.username)}
                                        helperText={formik.touched.username && formik.errors.username}
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
                                        name="birthday"
                                        id="date"
                                        label="Birthday"
                                        type="date"
                                        value={formik.values.birthday}
                                        // onChange={val => {
                                        //     setFieldValue(field.name, val);
                                        // }}
                                        onChange={formik.handleChange}
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
                                    <RadioGroup
                                        error={formik.errors.radbtn}
                                        touched={formik.touched.radbtn}
                                        aria-label="day" name="days" value={value} onChange={handleRadioGroupChange}
                                    >
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
                                        className={classes.submit} disabled={loading}> {/*onClick={handleRegister}*/}
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
                    <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noSkill}
                              autoHideDuration={3000} onClose={handlecloseSnack}>
                        <Alert onClose={handlecloseSnack} severity="warning">
                            Please check when you are going to play!
                        </Alert>
                    </Snackbar>

                    <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noRadio}
                              autoHideDuration={3000} onClose={handlecloseSnack}>
                        <Alert onClose={handlecloseSnack} severity="warning">
                            Please check a skill level!
                        </Alert>
                    </Snackbar>


                </Paper>
            </Container>
        </div>
    );
}

export default SignUp;