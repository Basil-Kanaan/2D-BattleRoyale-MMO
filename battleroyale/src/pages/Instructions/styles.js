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
        position: 'relative',
        height: 150,
        padding: 25,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        borderRadius: 5,
        boxShadow: '5px 5px 13px #ededed, -5px -5px 13px #ffffff;',
    },

    expectedTotal: {
        alignItems: "right",
        textAlign: 'right',
    },
    bottomCards: {
        marginTop: 30,
        height: 500,
        padding: 25,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        borderRadius: 5,
        boxShadow: '5px 5px 13px #ededed, -5px -5px 13px #ffffff;'
    },
    inner: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    main_container: {
        padding: "20 30",
    },
    main_greeting: {
        display: "flex",
        alignItems: "center",
    },
    hello_img: {
        maxHeight: 150,
        objectFit: "contain",
        marginRight: 20,
    },
    main_greeting_p: {
        fontSize: 14,
        fontWeight: 700,
        color: "#a5aaad"
    },
    main_greeting_h1: {
        fontSize: 24,
        color: "#2e4a66",

    }
}));
