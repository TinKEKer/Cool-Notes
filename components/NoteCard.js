import { makeStyles,useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import React, {useEffect, useState} from "react";
import EditIcon from '@material-ui/icons/Edit';
import { Chip } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius:'0px',
        width:'100%',
        minHeight:'100%',
        margin:'15px 0px 0px 0px',
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
    },
    title:{
       display:'flex',
        justifyContent:'center'
    }
}));

export default function NoteCard({data,open,setOpen,setEdit,setLiked}) {
    const classes = useStyles();



   const [note,setNote] = useState(data)


    return (
        <Card className={classes.root} raised={true} variant={"outlined"} >
        <CardContent>
            <CardHeader
                title={<Typography variant={"h5"} component={"h5"} className={classes.title}>{note.title}</Typography>}
                subheader={<Chip variant="outlined" color="primary" icon={<TodayIcon />} label={new Date(note.createdAt).toLocaleDateString("en-Us",{weekday:'long',year:'numeric',month:'long',day:'numeric'})} style={{width:'100%'}} /> }
                className={classes.cardHeader}
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