import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root:{
        display: 'flex',
    },
    gameView: {
        height: "150px",
        width: "300px",
        border: "1px solid black",
        position: "absolute",
        left: "50%",
        transform: "translate(-50%)",
        flexGrow: 1
    }
}));
