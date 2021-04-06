import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import {Chart} from "react-google-charts";
import OutlinedCard from '../BillCompare/SimpleCard';
import PageTitle from '../../components/PageTitle';
import FormDialoug from './FormDialoug';


const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },

    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(15, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    fixedHeightPaper: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        width: 240,
    },
    card: {
        padding: 200,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    barGraph: {
        paddingLeft: '50%',
        paddingTop: '50px'
    },
    addReview: {
        float: 'right',
    }

}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function BillCompare() {
    const classes = useStyles();

    return (
        <div style={{overflow: "hidden"}}>
            <PageTitle title="Compare Bills"/>
            
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="left" xs={12}>

                    <Grid item>
                        <OutlinedCard title="Internet Bill Compare"/>
                    </Grid>

                    <Grid item>
                        <OutlinedCard title="Electricity Bill Compare"/>
                    </Grid>

                    <Grid item>
                        <OutlinedCard title="Phone Bill Compare"/>
                    </Grid>
                </Grid>
                
                <Chart
                    className={classes.barGraph}
                    width={'500px'}
                    height={'300px'}
                    chartType="Bar"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Category', 'You', 'Average'],
                        ['Utilities', 500, 500],
                        ['Food', 450, 300],
                        ['Internet', 60, 85],
                        ['Mobile Phone', 65, 100],
                    ]}
                    options={{
                        // Material design options
                        chart: {
                            title: 'Your Spending Compared to Others',
                            subtitle: 'in dollars (CAD)',
                        },
                    }}
                    // For tests
                    rootProps={{'data-testid': '2'}}
                />
            </Container>
            
            
        </div>

    );
}