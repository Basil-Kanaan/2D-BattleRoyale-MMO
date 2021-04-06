import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FullScreenDialog from '../BillCompare/FullScreenDialouges';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    cardContent: {
        backgroundColor: "#EDF2F4",
        padding: "20px",
        margin: "20px",
        color: '#2B2D42',
        flexGrow: 1,
    },
});

export default function OutlinedCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.cardContent} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    {props.title}
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.price}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">

                </Typography>
                <Typography variant="body2" component="p">
                </Typography>
            </CardContent>
            <CardActions>
                <FullScreenDialog/>
            </CardActions>
        </Card>
    );
}