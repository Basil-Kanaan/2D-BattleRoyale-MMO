import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    gameView: {
        alignSelf: "center",
        border: "1px solid black"
    },
}));
