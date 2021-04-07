import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    game: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    }
}));
