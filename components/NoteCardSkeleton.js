import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';
import React from "react";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 345,
        margin: theme.spacing(2),
    },
    media: {
        height: 100,
    },
    title:{
        marginBottom: 6,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }
}));

export default function NoteCardSkeleton() {

    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader
                titleTypographyProps={{className:classes.title}}
                title={
                        <Skeleton animation="wave" height={15} width="50%"  />
                }
                subheader={<Skeleton animation="wave" height={20} width="100%" />}
            />

                <Skeleton animation="wave" variant="rect" className={classes.media} />
            <CardContent>
                <Grid container>
                    <Grid item xs={6}>
                    <Skeleton animation="wave" variant="circle" width={25} height={25} style={{ marginRight:'auto' }} />
                    </Grid>
                    <Grid item xs={6}>
                    <Skeleton animation="wave" variant="circle" width={25} height={25}  style={{ marginLeft:'auto' }} />
                    </Grid>
                </Grid>
            </CardContent>

        </Card>
    );
}

