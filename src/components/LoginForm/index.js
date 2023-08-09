import React, {useContext} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {AuthContext} from '../../contexts/AuthContext';
import useStyles from './styles';

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

function LoginForm() {
    const classes = useStyles();
    const {updateAuth} = useContext(AuthContext);
    const [loading, setLoading] = React.useState(false);
    const [confirmPass, setConfirmPass] = React.useState(false);
    const [open, setOpen] = React.useState(false);

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
            setTimeout(() => {
                setLoading(false);
                handleLogin(values);
            }, 2000);
        },
    });

    return (
        <Card className={classes.card}>
            <Typography align="center" component="h1" variant="h4">
                Login
            </Typography>
            <hr border="1px solid gray" height="1px" width="60%" color="#dbdbdb"/>
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
                            error={confirmPass || (formik.touched.password && Boolean(formik.errors.password))}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    </Grid>
                </Grid>
                <div className={classes.wrapper}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        className={classes.submit}
                        disabled={loading}
                        onClick={() => {
                            window.location.href = '/app/play';
                        }}
                    >
                        {loading ? '' : 'Login'}
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                </div>
            </form>
            <Grid container justifyContent="center">
                <Grid item>
                    <Link href="/register" variant="body2">
                        Don't have an account? Register
                    </Link>
                </Grid>
            </Grid>
        </Card>
    );
}

export default LoginForm;
