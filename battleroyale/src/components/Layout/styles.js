import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root: {
        display: "flex",
        maxWidth: "100vw",
        overflowX: "hidden",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: `calc(100vw - 240px)`,
        minHeight: "100vh",
    },
    Title: {
        padding: theme.spacing(5),
    },
}));
