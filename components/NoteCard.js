import { makeStyles,useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import  axios from "axios";
import {useEffect, useState} from "react";
import EditIcon from '@material-ui/icons/Edit';
import FormDialog from "./UpdateNote";
import {Grid} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius:'0px',
        margin:'15px 0px 0px 0px',
        height:'100%',
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }

    },
    avatar: {
        backgroundColor: red[500],
    },
    button:{
      marginRight:'auto',
        transition:theme.transitions.create(['color','transform'],{
            duration:theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut
        }),
        "&:active":{
            transform: "scale(1.3)"
        },
    },
    buttonLiked:{
      color:'#F32E3D'
    },
    editButton:{
        marginLeft:'auto'
    }
}));

export default function NoteCard({data,open,setOpen,setEdit,setLiked}) {
    const classes = useStyles();



   const [note,setNote] = useState(data)


    return (
        <Card className={classes.root} raised={true} >
        <CardContent >
            <CardHeader
                title={note.title}
                subheader={ new Date(note.createdAt).toLocaleDateString("en-Us",{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {note.description}
                </Typography>
            </CardContent>
            <CardActions >
                <IconButton aria-label="add to favorites" className={clsx(classes.button,{
                    [classes.buttonLiked]:note.liked,
                })} onClick={()=>setLiked(note)}>
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="edit" className={classes.editButton} onClick={()=> {
                    setOpen(!open)
                    setEdit(note)
                }}>
                    <EditIcon />
                </IconButton>
            </CardActions>
        </CardContent>
        </Card>
    );
}