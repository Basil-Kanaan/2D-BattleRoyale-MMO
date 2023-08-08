import {makeStyles} from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    cardGrid: {
        padding: 0,
    },
    card: {
        marginTop: 30,
        position: 'relative',
        height: 150,
        padding: 25,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        borderRadius: 5,
        boxShadow: '5px 5px 13px #ededed, -5px -5px 13px #ffffff;',
    },

    table: {
        width: 200,
        borderColor: 'red',
    },
    container: {
        marginLeft: "80%",
        width: 200,
        alignItems: "center",
        textAlign: 'center',
        borderColor: 'red',
    },
    cont1: {
        marginRight: "10%",
        height: 400,
    },
    cont2: {
        height: 400,
        marginLeft: "10%",
    },
    usercontainer: {
        marginLeft: "10%",
        width: 200,
        borderColor: 'red',
        alignItems: "center",
        textAlign: 'center',
    },
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}));
