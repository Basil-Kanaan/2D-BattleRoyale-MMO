import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";

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

export default useStyles;