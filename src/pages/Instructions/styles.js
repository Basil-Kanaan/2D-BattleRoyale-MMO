import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(6),
    },
    card: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
        textAlign: 'left',
        borderRadius: theme.spacing(1),
        boxShadow: theme.shadows[3],
        fontSize: 18
    },
    cardTitle: {
        textAlign: 'center',
        fontSize: 36,
        marginBottom: theme.spacing(2),
        fontWeight: "bolder"
    },
    purpleText: {
        color: theme.palette.primary.main,
    },
    blueText: {
        color: theme.palette.info.main,
    },
    yellowText: {
        color: theme.palette.warning.main,
    },
    greenText: {
        color: theme.palette.success.main,
    },
    gunTypeText: {
        color: theme.palette.secondary.main,
    },
}));
