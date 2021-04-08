import React, {useContext} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import PersonIcon from '@material-ui/icons/Person';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {makeStyles} from '@material-ui/core/styles';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {AuthContext} from '../../contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
    app: {
        color: '#FBFAF8',
        backgroundColor: '#0A122A',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
    },
    nav: {
        display: 'flex',
    },
    icon: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: '5%',
    },
    tabs: {
        marginRight: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 1000,
    },
}));

export default function AppNavbar() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const {updateAuth, updateToken} = useContext(AuthContext);

    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    const handleLogout = () => {
        setAnchorEl(null);
        updateAuth(false);
        localStorage.removeItem("token");
        window.location.href = '/';
    };
    return (
        <AppBar className={classes.app}>
            <Toolbar className={classes.nav}>
                <Typography variant="h6" className={classes.icon}>
                    Battle Royale
                </Typography>
                <Tabs className={classes.tabs}>
                    <Tab onClick={() => {
                        window.location.href = '/#/app/play';
                    }} label="Play" icon={<HomeIcon/>}/>
                    <Tab onClick={() => {
                        window.location.href = '/#/app/instructions';
                    }} label="Instructions" icon={<FileCopyIcon/>}/>
                    <Tab onClick={() => {
                        window.location.href = '/#/app/stats';
                    }} label="Stats" icon={<EqualizerIcon/>}/>
                    <Tab onClick={() => {
                        window.location.href = '/#/app/profile';
                    }} label="Profile" icon={<PersonIcon/>}/>
                    <Tab onClick={handleLogout} label="Logout" icon={<CompareArrowsIcon/>}/>
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}