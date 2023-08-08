import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    pageTitleContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(1),
    },
    typo: {
        color: theme.palette.text.hint,
    },
}));
