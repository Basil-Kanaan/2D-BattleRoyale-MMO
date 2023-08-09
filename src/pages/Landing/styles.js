import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        backgroundImage: 'url(https://wallpapercave.com/wp/wp6308454.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative', // Add position relative
    },

    playButton: {
        position: 'absolute',
        bottom: '15%', // Adjust as needed
        left: '50%',
        transform: 'translateX(-50%)',
    },
    about: {
        height: '80vh',
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

export default useStyles;
