import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import {Chip} from "@material-ui/core";
import TodayIcon from "@material-ui/icons/Today";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import EditIcon from "@material-ui/icons/Edit";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    button:{
        marginRight:'auto',
},
    editButton:{
        marginLeft:'auto'
    },
    title:{
        display:'flex',
        justifyContent:'center'
    }
}));



export default function NotePreview({data}) {

    const date = Date.now()

    const classes = useStyles()

    return (
        <Card  raised={true} variant={"outlined"} >
            <CardContent>
                <CardHeader
                    title={<Typography variant={"h5"} component={"h5"} className={classes.title}>{data.title}</Typography>}
                    subheader={<Chip variant="outlined" color="primary" icon={<TodayIcon />} label={new Date(date).toLocaleDateString("en-Us",{weekday:'long',year:'numeric',month:'long',day:'numeric'})} style={{width:'100%'}} /> }
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {data.description}
                    </Typography>
                </CardContent>
                <CardActions >
                    <IconButton aria-label="add to favorites" disabled={true} className={classes.button} >
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="edit"  disabled={true} className={classes.editButton}>
                        <EditIcon />
                    </IconButton>
                </CardActions>
            </CardContent>
        </Card>
    );
}