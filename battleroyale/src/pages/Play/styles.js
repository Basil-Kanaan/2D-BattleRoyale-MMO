import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    gameView: {
        height: "85vh",
        width: "85vh",
        border: "1px solid black",
        position: "absolute",
        left: "50%",
        transform: "translate(-50%)"
    }
}));
