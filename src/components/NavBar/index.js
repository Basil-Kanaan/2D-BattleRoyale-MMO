import React, { useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import PersonIcon from '@material-ui/icons/Person';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

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
    const classes = useStyles();
    const { updateAuth, updateToken } = useContext(AuthContext);
    const history = useHistory();
    const [value, setValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handlePlay = () => {
        history.push('/app/play');
    };

    const handleInstructions = () => {
        history.push('/app/instructions');
    };

    const handleStats = () => {
        history.push('/app/stats');
    };

    const handleProfile = () => {
        history.push('/app/profile');
    };

    const handleLogout = () => {
        updateAuth(false);
        localStorage.removeItem('token');
        history.push('/');
    };

    return (
        <AppBar className={classes.app}>
            <Toolbar className={classes.nav}>
                <Typography variant="h6" className={classes.icon}>
                    Battle Royale
                </Typography>
                <Tabs
                    className={classes.tabs}
                    value={value}
                    onChange={handleTabChange}
                    centered
                >
                    <Tab label="Play" onClick={handlePlay} icon={<HomeIcon />} />
                    <Tab label="Instructions" onClick={handleInstructions} icon={<FileCopyIcon />} />
                    <Tab label="Stats" onClick={handleStats} icon={<EqualizerIcon />} />
                    <Tab label="Profile" onClick={handleProfile} icon={<PersonIcon />} />
                    <Tab label="Logout" onClick={handleLogout} icon={<CompareArrowsIcon />} />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}
