import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from 'next/link'
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Formik,Form,Field} from "formik";
import * as Yup from 'yup';
import {
    TextField
} from 'formik-material-ui';
import  axios from 'axios'
import React from "react";
import {useSnackbar} from "notistack";
import {useRouter} from "next/router";
import {axiosVar} from "../utils/axiosVar";
import SignIn from "./signin";

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
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();

    const SignUpSchema = Yup.object().shape({
        email:Yup.string().required('E-mail is required'),
        password:Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
        firstName:Yup.string().required('Enter your First Name'),
        lastName:Yup.string().required('Enter your Last Name')
    })


    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Formik initialValues={{
                email:'',
                password:'',
                    firstName:'',
                    lastName:''
            }}
                validationSchema={SignUpSchema}
                onSubmit={(values,...other)=>{
                if(values){
                   console.log(values)
                    axios.post(`${axiosVar}api/auth/signup`,{
                            email:values.email,
                            password:values.password,
                            firstName:values.firstName,
                            lastName:values.lastName
                        }).then(data=>{
                        console.log(data)
                           enqueueSnackbar(data.data.message,{
                               variant:'success'
                           })
                        router.push(`/Confirmation?email=${values.email}`)
                    }
                    ).catch(e=> {
                            console.log(e)
                        enqueueSnackbar('Looks like user allready exists',{
                            variant:'error'
                        })
                        other[0].setFieldError('general', 'User All Ready Exists')
                        other[0].setSubmitting(false)
                    })
                    return
                }
                console.log(other)
                other[0].setFieldError('general','Wrong E-mail or Password')
                other[0].setSubmitting(false)
                return;

            }}
                >
                {({errors,touched,isValid,dirty})=>(
                    <Form className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Field
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                component={TextField}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                component={TextField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                component={TextField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                component={TextField}
                            />
                        </Grid>
                    </Grid>
                        <Typography style={{ color: 'red',display:'flex',justifyContent:'center' }} variant="body2">{errors.general}</Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/signin" >
                                <a>Already have an account? Sign in</a>
                            </Link>
                        </Grid>
                    </Grid>
                    </Form>
                )}
                </Formik>
            </div>

        </Container>
    );
}

SignUp.getInitialProps = async (ctx)=>{
    await axios.get(`${axiosVar}api/start`)

    return{
        data:'Done'
    }

}