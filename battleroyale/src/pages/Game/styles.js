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
    playAgain:{
        marginTop: "20px",
        display: "flex",
        alignSelf: "center",
        height: '40px',
        width: "614px",
        backgroundColor: "#E7DECD",
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: "rgba(231,222,205,0.6)"
        } ,
    }
}));
