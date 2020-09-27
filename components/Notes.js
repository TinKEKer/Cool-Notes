import NoteCard from "../components/NoteCard";
import {myGet} from "../utils/myGet";
import {useContext, useEffect, useState} from "react";
import {Context} from "../utils/reducer/reducer";
import {decode} from 'jsonwebtoken'
import parseCookie from "../utils/parseCookie";
import  axios from "axios";
import {SortableContainer, sortableElement} from 'react-sortable-hoc';
import SwipeToDelete from "react-swipe-to-delete-ios";
import {useSnackbar} from "notistack";
import FormDialog from "../components/UpdateNote";
import {useRouter} from "next/router";
import {axiosVar} from "../utils/axiosVar";
import { Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import NoteCardSkeleton from "../components/NoteCardSkeleton";
import {sortedArr} from "../utils/sortArr";


const useStyles = makeStyles((theme) => ({

    helper:{
        height:'100%',
        width:'100%',
        display: "inline-flex",
        justifyContent:'center',
    }
}));





export  default  function NotesComponent ({notes,type}){
    const [state,dispatch] = useContext(Context)

    const classes = useStyles()

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [note,setNote] = useState(undefined)

    const [update,setUpdate] = useState(false)

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const email = state.email!==undefined&&state.email!==''?state.email:localStorage.getItem('email')
            axios.get(`${axiosVar}api/notes?email=${email}`).then(data=>{
                setNote(data.data.data)
                router.events.on('routeChangeStart', ()=>setUpdate(true))
                return ()=>{
                    router.events.off('routeChangeStart',setToUpdate)
                }
            });
        }
        if(notes.data.length===0){
            fetchData();
        }else {
            setNote(notes.data)
        }

    }, []);

    useEffect(()=>{
        const sorted=notes.length!==0?sortedArr(notes.data,type[0],type[1]!==undefined?type[1]:''):null
        setNote(sorted)
    },[type])


    useEffect(()=>{
        updateBeforeUnload()
    },[update])



    const setToUpdate = (data,oldData)=>{
        let newArr = note.map((item) => {
            if (item._id == oldData._id) {
                return { ...item, title:data.title,description:data.description };
            } else {
                return item;
            }
        });
        setNote(newArr);
        enqueueSnackbar('Note updated',{
            variant:'success'
        })

    }


    const setLiked = (data)=>{
        let newArr = note.map((item) => {
            if (item._id == data._id) {
                return { ...item, liked: !item.liked };
            } else {
                return item;
            }
        });
        setNote(newArr);
    }



    const onSortEnd = ({oldIndex, newIndex}) => {

        const noteCopy = note.slice();
        const oldIdBackup = noteCopy[oldIndex].noteId;
        noteCopy[oldIndex].noteId=noteCopy[newIndex].noteId
        noteCopy[newIndex].noteId=oldIdBackup
        const oldIdxBackup = noteCopy[oldIndex];
        noteCopy[oldIndex] = noteCopy[newIndex];
        noteCopy[newIndex] = oldIdxBackup;
        setNote(noteCopy)
        console.log(noteCopy)


    };



    const updateBeforeUnload =  ()=>{
        axios.put(`${axiosVar}api/notes`,note)
    }


    const handleDelete = itemToDelete => {
        axios.delete(`${axiosVar}api/notes/${itemToDelete._id}`
        ).then(data=>{
            enqueueSnackbar('Note Deleted',{
                variant:'error'
            })
            setNote(note.filter(item => item !== itemToDelete))
        })

    }

    const [open,setOpen]=useState(false)
    const [edit,setEdit] = useState(undefined)

    const SortableItem = sortableElement(({value}) =>
        <Grid container className={classes.helper}>
            <Grid item xs={10} md={7} lg={6} >
                <SwipeToDelete onDelete={()=>handleDelete(value)}  height={"100%"}  deleteWidth={75} >
                    <NoteCard data={value} open={open} setOpen={setOpen} setEdit={setEdit} setLiked={setLiked} updateNote={setNote}/>
                </SwipeToDelete>
            </Grid>
        </Grid>

    )
    const SortableList = SortableContainer(({items}) => {
        return (
            <ul style={{margin:'auto',paddingLeft:'0px'}}>
                {items.map((value, index) => (
                    <SortableItem value={value} key={value._id} index={index}  key={value._id} id={'item'} />
                ))}
            </ul>
        );
    });

    return(
        <>
            {note!==undefined?
                <SortableList items={note} onSortEnd={onSortEnd} pressDelay={300} lockAxis="y" transitionDuration={500} useWindowAsScrollContainer={true} />
                :
                <Grid container
                      spacing={4}
                      direction="column"
                      alignItems={"center"}
                >
                    <Grid  item xs={12}  style={{width:'50%'}}  >
                        <NoteCardSkeleton/>
                    </Grid>
                    <Grid  item xs={12}  style={{width:'50%'}}  >
                        <NoteCardSkeleton/>
                    </Grid>
                    <Grid  item xs={12}  style={{width:'50%'}}  >
                        <NoteCardSkeleton/>
                    </Grid>
                </Grid>}
            {edit!==undefined?<FormDialog open={open} close={() => {
                setOpen(false)
            }} data={edit} setToUpdate={setToUpdate} />:null}
        </>
    )
}

