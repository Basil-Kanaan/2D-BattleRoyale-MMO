import React, {useEffect} from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import useStyles from './styles';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function Profile() {
    const classes = useStyles();

    const [value, setValue] = React.useState(0);
    const [values, setValues] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });
    const [passwords, setPasswords] = React.useState({
        current_password: '',
        new_password: '',
        new_password2: ''
    });
    const [currPass, setCurrPass] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [passwordOpen1, setPasswordOpen1] = React.useState(false);
    const [passwordOpen2, setPasswordOpen2] = React.useState(false);
    const [passwordOpen, setPasswordOpen] = React.useState(false);
    const [deletePassword, setDeletePassword] = React.useState("");
    const [deletePasswordWrong, setDeletePasswordWrong] = React.useState(false);
    const [originalEmail, setOriginalEmail] = React.useState("");
    const [radio, setRadio] = React.useState('');

    const timer = React.useRef();

    const [box, setBox] = React.useState({
        Morning: false,
        Afternoon: false,
        Night: false,
    });
    const {Morning, Afternoon, Night} = box;

    const handleDeletePassChange = (event) => {
        setDeletePassword(event.target.value);
    };
    const handleChange = (event, newValue) => {
        setPasswordOpen2(false);
        setPasswordOpen(false);
        setValue(newValue);
    };
    const handleProfileChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };
    const handlePasswordChange = (prop) => (event) => {
        setPasswordOpen2(false);
        setPasswordOpen(false);
        setPasswords({...passwords, [prop]: event.target.value});
    };
    const handleClick = () => {
        handleInfoChange();
        setOpen(true);
    };

    const handlePasswordClick = () => {
        changePassword();
    };

    const getUserInfo = () => {
        fetch('http://localhost:8000/api/user/profile', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            setCurrPass(data.password);
            setOriginalEmail(data.email);
            setValues({...values, first_name: data.firstName, last_name: data.lastName, email: data.email});
        }).catch(err => {
            console.log("Error");
        });
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

    const handleInfoChange = () => {
        var details = {
            'firstName': values.first_name,
            'lastName': values.last_name,
            "original_email": originalEmail,
            'email': values.email
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        console.log(formBody);
        fetch('http://localhost:8000/api/user', {
            method: 'PATCH',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            setOriginalEmail(data.email);
            setValues({...values, first_name: data.firstName, last_name: data.lastName, email: data.email});
        }).catch(err => {
            console.log("Error");
        });
    };

    const changePassword = () => {
        if (passwords.new_password !== passwords.new_password2) {
            setPasswordOpen(true);
            return;
        } else {
            setPasswordOpen(false);
        }
        //setPasswordOpen2(true);
        //setPasswordOpen2(false);
        var details = {
            'email': values.email,
            'currentpassword': passwords.current_password,
            'password': passwords.new_password
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch('http://localhost:8000/api/user/password', {
            method: 'PATCH',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data === "Invalid password") {
                setPasswordOpen2(true);
            } else {
                setPasswordOpen2(false);
                getUserInfo();
                setPasswordOpen1(true);
            }
        }).catch(err => {
            console.log(err);
        });
    };

    const handleDeleteAccount = () => {
        var details = {
            'email': values.email,
            'password': deletePassword,
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch('http://localhost:8000/api/user', {
            method: 'DELETE',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            if (data === "Invalid Password!") {
                setDeletePasswordWrong(true);
            } else {
                timer.current = window.setTimeout(() => {
                    localStorage.removeItem("token");
                    window.location.href = '/';
                }, 200);
            }
        }).catch(err => {
            console.log(err);
        });

    };

    const handleDialogOpen = (event, reason) => {
        setDialogOpen(true);
    };

    const handleDialogClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDialogOpen(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setPasswordOpen(false);
        setOpen(false);
    };

    const handleClosePass = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setPasswords({...passwords, current_password: "", new_password: "", new_password2: ""});
        setPasswordOpen1(false);
    };

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const handleRadioGroupChange = (event) => {
        setRadio((event.target).value);
    };

    const handleCheckBtnChange = (event) => {
        setBox({...box, [event.target.value]: event.target.checked});
    };

    useEffect(() => {
        checkAuth();
        getUserInfo();
    }, []);

    return (
        <div className={classes.root}>
            <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} open={open} autoHideDuration={1000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Sucessfully Saved!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} open={passwordOpen1} autoHideDuration={1000} onClose={handleClosePass}>
                <Alert onClose={handleClosePass} severity="success">
                    Sucessfully Changed!
                </Alert>
            </Snackbar>
            <main className={classes.content}>
                <Typography className={classes.pageTitle} variant="h4">
                    Account Settings
                </Typography>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} lg={2}>
                            <Paper className={fixedHeightPaper}>
                                <Tabs
                                    orientation="vertical"
                                    value={value}
                                    onChange={handleChange}
                                >
                                    <Tab label="General" {...a11yProps(0)} />
                                    <Tab label="Security" {...a11yProps(1)} />
                                </Tabs>
                                <Button onClick={() => {
                                    handleDialogOpen();
                                }} className={classes.logout}
                                        color="secondary">Delete Account</Button>
                                <Dialog open={dialogOpen} onClose={handleDialogClose}
                                        aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Delete account</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want do delete your account? Enter your password
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            label="Password"
                                            type="password"
                                            onChange={handleDeletePassChange}
                                            error={deletePasswordWrong}
                                            helperText={deletePasswordWrong ? "Wrong Password" : ""}
                                            fullWidth
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleDialogClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleDeleteAccount} color="primary">
                                            Delete
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper className={fixedHeightPaper}>
                                <div>
                                    <TabPanel value={value} index={0}>
                                        <Typography variant='overline'>Account Details</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <FormControl id="Username" fullWidth variant="outlined">
                                                    <InputLabel disabled={true} htmlFor="outlined-adornment-firstname">
                                                        Username
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        disabled={true}
                                                        id="outlined-adornment-firstname"
                                                        value={values.first_name}
                                                        onChange={handleProfileChange('first_name')}
                                                        labelWidth={80}
                                                    />
                                                </FormControl>

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
                                                <RadioGroup aria-label="day" name="days" value={radio}
                                                            onChange={handleRadioGroupChange}>
                                                    <FormControlLabel value="Beginner" control={<Radio/>}
                                                                      label="Beginner"/>
                                                    <FormControlLabel value="Intermediate" control={<Radio/>}
                                                                      label="Intermediate"/>
                                                    <FormControlLabel value="Advanced" control={<Radio/>}
                                                                      label="Advanced"/>
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
                                                        <Checkbox checked={Night} onChange={handleCheckBtnChange}
                                                                  value="Night"/>
                                                    }
                                                    label="Night"
                                                />
                                            </Grid>

                                        </Grid>
                                        <Button className={classes.saveBtn} onClick={handleClick} variant="contained"
                                                color="primary"> Save Changes</Button>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <Typography className={classes.paperTitle}>Account Security</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="currentpassword"
                                                    required
                                                    fullWidth
                                                    type="password"
                                                    value={passwords.current_password}
                                                    onChange={handlePasswordChange('current_password')}
                                                    label="Current Password"
                                                    variant="outlined"
                                                    error={passwordOpen2}
                                                    helperText={passwordOpen2 ? "Wrong Password" : ""}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="newpassword"
                                                    required
                                                    fullWidth
                                                    value={passwords.new_password}
                                                    type="password"
                                                    onChange={handlePasswordChange('new_password')}
                                                    label="New Password"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="newpasswordrep"
                                                    fullWidth
                                                    required
                                                    value={passwords.new_password2}
                                                    type="password"
                                                    onChange={handlePasswordChange('new_password2')}
                                                    label="Confirm New Password"
                                                    variant="outlined"
                                                    error={passwordOpen}
                                                    helperText={passwordOpen ? "Passwords don't match" : ""}
                                                />
                                            </Grid>

                                        </Grid>
                                        <Button className={classes.saveBtn} onClick={handlePasswordClick}
                                                variant="contained"
                                                color="primary"> Change Password</Button>

                                    </TabPanel>
                                </div>

                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
}
