import React, {useContext, useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from 'next/link'
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Visibility, VisibilityOff} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {Formik,Form,Field} from "formik";
import * as Yup from 'yup';
import {
    TextField
} from 'formik-material-ui';
import  axios from 'axios'
import {useRouter} from "next/router";
import {Context} from "../utils/reducer/reducer";
import { useSnackbar } from 'notistack';
import {axiosVar} from "../utils/axiosVar";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export default function SignIn() {

    useEffect(()=>{

        localStorage.clear()
    },[])

    const router = useRouter();
    const SignInSchema = Yup.object().shape({
        email:Yup.string().required('E-mail is required'),
        password:Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
    })

    const [visible,setVisible]=useState(false)

    const handleClickShowPassword = () => {
        setVisible(!visible)
    };

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [state,dispatch] = useContext(Context);


    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Formik initialValues={{
                    email:'',
                    password:''
                }}
                        validationSchema={SignInSchema}
                        onSubmit={(values,...other)=>{
                            if(values){
                                axios.post(`${axiosVar}api/login/`,{
                                    email:values.email,
                                    password:values.password
                                    },
                                    {
                                        headers:{
                                            'Content-Type':'application/json'
                                        }
                                    }).then(data=>{
                                    dispatch({
                                        type: "Login",
                                        payload: {email:data.data.email,mode:data.data.mode}
                                    })

                                    localStorage.setItem('email', values.email)

                                    enqueueSnackbar(data.data.message, {
                                        variant: 'success',
                                        horizontal: 'right'
                                    })

                                    router.push({
                                        pathname: '/Notes',
                                        query: {email: values.email},
                                        asPath: "Notes"
                                    })

                                }).catch(e=>{
                                    console.log(e)
                                    other[0].setFieldError('general', 'Wrong E-mail or Password')
                                    other[0].setSubmitting(false)
                                })
                            }
                        }}
                >
                    {({errors,touched,isValid,dirty})=>(
                        <Form className={classes.form}>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                component={TextField}
                            />
                            <Field
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={visible?'text':'password'}
                                id="password"
                                autoComplete="current-password"
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={handleClickShowPassword} >
                                            {visible?<Visibility/>:<VisibilityOff/>}
                                        </IconButton>
                                    )
                                }}
                                component={TextField}
                            />
                            <>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    disabled={!(isValid && dirty)}
                                >
                                    Sign In
                                </Button>
                                <Typography style={{ color: 'red',display:'flex',justifyContent:'center' }} variant="body2">{errors.general}</Typography>
                            </>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="/signup">
                                        <a>Don't have an account? Sign Up</a>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    )
}

SignIn.getInitialProps = async (ctx)=>{
  await axios.get(`${axiosVar}api/start`)

    return{
       data:'Done'
    }

}
