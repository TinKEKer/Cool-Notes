import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import SendIcon from '@material-ui/icons/Send';
import {TextField}  from "formik-material-ui";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import React from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import {axiosVar} from "../utils/axiosVar";

const useStyles = makeStyles((theme) => ({
    root: {
        width:'100%',
    },
    avatar: {
        backgroundColor: red[500],
    },
    buttons:{
        marginLeft:'auto'
    }
}));

export default function NoteField() {
    const classes = useStyles();

    const CreateNoteSchema = Yup.object().shape({
        title:Yup.string().required('Title is required').min(1,'Enter valid title'),
        description:Yup.string().required('Description is required').min(1,'Enter valid description')
    })

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    return (
        <Formik initialValues={{
            title:'',
            description:'',
            createdBy: typeof window !== 'undefined'?localStorage.getItem('email'):''
        }}
                validationSchema={CreateNoteSchema}
                onSubmit={(values,...other)=>{
                    if(values){
                        axios.post(`${axiosVar}api/notes/`,{
                                title:values.title,
                                description:values.description,
                                createdBy:values.createdBy
                            },
                            {
                                headers:{
                                    'Content-Type':'application/json'
                                }
                            }).then(data=>{

                             console.log(data)
                            enqueueSnackbar(data.statusText,{
                                variant:'success'
                            })
                            other[0].resetForm({})
                            other[0].setSubmitting(false)

                        }).catch(e=>{
                            console.log(e)
                            enqueueSnackbar('Something went wrong',{
                                variant:'error'
                            })
                            other[0].setFieldError('general', 'Something went wrong')
                            other[0].setSubmitting(false)
                        })
                    }
                }}
        >
            {({errors,touched,isValid,dirty})=>(
                <Form className={classes.form}>
        <Card className={classes.root}>
            <CardContent >
                <CardHeader
                    title={<Field variant={"outlined"} label={"Title"} name="title" id={'title'} multiline component={TextField} />}
                />
                <CardContent>
                    <Field variant={"outlined"} label={"Description"} name={"description"} id={'description'} multiline component={TextField} fullWidth  />
                </CardContent>
                <CardActions>
                    <IconButton type={"submit"} disabled={!(isValid && dirty)} color={"primary"}>
                        <SendIcon />
                    </IconButton>
                </CardActions>
            </CardContent>
        </Card>
                </Form>
            )}
        </Formik>
    );
}