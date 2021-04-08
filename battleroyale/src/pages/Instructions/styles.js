import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    cardGrid: {
        padding: 0,

    },
    card: {
        marginTop: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        height: 600,
        width: 600,
        padding: 25,
        textAlign: 'center',
        alignItems: "center",
        color: theme.palette.text.secondary,
        borderRadius: 5,
        boxShadow: '5px 5px 13px #ededed, -5px -5px 13px #ffffff;',
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 30,
    }

}));
