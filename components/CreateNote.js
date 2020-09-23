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

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import NotePreview from "./NotePreview";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

function getSteps() {
    return ['Enter Title(This field is required)', 'Enter Description(This field is required)', 'Create a Note'];
}

function getStepContent(step,values) {
    switch (step) {
        case 0:
            return  <Field variant={"outlined"} label={"Title"} name="title" id={'title'} multiline component={TextField} fullWidth  />
        case 1:
            return   <Field variant={"outlined"} label={"Description"} name={"description"} id={'description'} multiline component={TextField} fullWidth  />
        case 2:
            return <NotePreview data={values} />;
        default:
            return 'Unknown step';
    }
}



export default function NoteField() {
    const classes = useStyles();

    const CreateNoteSchema = Yup.object().shape({
        title:Yup.string().required('Title is required').min(1,'Enter valid title'),
        description:Yup.string().required('Description is required').min(1,'Enter valid description')
    })

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();


    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const isLastStep = () => {
        return activeStep === steps.length - 1;
    };


    return (
        <Formik initialValues={{
            title:'',
            description:'',
            createdBy: typeof window !== 'undefined'?localStorage.getItem('email'):''
        }}
                validationSchema={CreateNoteSchema}
                onSubmit={(values,...other)=>{
                    if(values){
                        if (!isLastStep()) {
                            console.log(values)

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
                    }
                        other[0].setSubmitting(false);

                }}
        >
            {({errors,touched,isValid,dirty,values})=> {

                return <Form className={classes.root}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                    {index !== 2 ? getStepContent(index) : getStepContent(index, values)}
                                    <div className={classes.actionsContainer}>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                className={classes.button}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                                disabled={isLastStep()?!isValid:false}
                                                type="submit"


                                            >
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                            <Button onClick={handleReset} className={classes.button} variant={"outlined"}>
                                Add 1 more note
                            </Button>
                    )}
                </Form>
            }}
        </Formik>
    );
}