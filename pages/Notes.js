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
import {Skeleton} from "@material-ui/lab";
import FormDialog from "../components/UpdateNote";
import {useRouter} from "next/router";
import ReactDOM from 'react'


export  default  function Notes ({notes}){
   const [state,dispatch] = useContext(Context)

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [note,setNote] = useState(undefined)

    const [update,setUpdate] = useState(false)

    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const email = state.email!==undefined&&state.email!==''?state.email:localStorage.getItem('email')
        axios.get(`https://cool-notes.vercel.app/api/notes?email=${email}`).then(data=>{
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
            axios.put('https://cool-notes.vercel.app/api/notes',note)
        }


   const handleDelete = itemToDelete => {
       axios.delete(`https://cool-notes.vercel.app/api/notes/${itemToDelete._id}`
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
        <div>
        <SwipeToDelete onDelete={()=>handleDelete(value)}  height={220} deleteWidth={75}>
        <NoteCard data={value} open={open} setOpen={setOpen} setEdit={setEdit} setLiked={setLiked} updateNote={setNote}/>
        </SwipeToDelete>
        </div>
    )
    const SortableList = SortableContainer(({items}) => {
        return (
            <ul>
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
                :<Skeleton height={280}/>}
            {edit!==undefined?<FormDialog open={open} close={() => {
                setOpen(false)
            }} data={edit} setToUpdate={setToUpdate}/>:null}
        </>
    )
}


Notes.getInitialProps = async (ctx) => {

  const cookieProps = parseCookie(ctx.req).auth
    const cookieEmail = cookieProps?decode(cookieProps).email:''

    ctx.query={
        email: cookieEmail===''?ctx.query.email:cookieEmail
    }

const json = await myGet(`https://cool-notes.vercel.app/api/notes?email=${ctx.query.email}`,ctx);

  console.log(json)
return{
    notes:json
  }
}
