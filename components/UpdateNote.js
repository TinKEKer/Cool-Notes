import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import {TextField} from 'formik-material-ui'


export default function FormDialog(props) {

    const UpdateSchema = Yup.object().shape({
        title:Yup.string().required('Title is Required'),
        description:Yup.string().required('Description is required')
    })


    return (
        <Dialog open={props.open} onClose={props.close} >
            <Formik initialValues={{
                title:props.data.title,
                description:props.data.description
            }}
                    validationSchema={UpdateSchema}
                    onSubmit={(values,...other)=>{
                        if(values){
                                props.setToUpdate(values,props.data)
                                props.close()
                                other[0].setSubmitting(false)
                            }
                        }
                    }
            >
                {({errors,touched,isValid,dirty})=>(
                    <Form>
                <DialogTitle id="form-dialog-title">
                    <Field
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        component={TextField}
                    />
                </DialogTitle>
                <DialogContent>
                        <Field
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            component={TextField}
                        />
                </DialogContent>
                <DialogActions style={{display:'flex'}}>
                    <Button type="submit" color="primary" style={{flexGrow:1}}  disabled={!(isValid && dirty)}>
                        Update
                    </Button>
                    <Button onClick={props.close} color="primary" style={{flexGrow:1}}>
                        Cancel
                    </Button>
                </DialogActions>
                    </Form>
                    )}
                    </Formik>
            </Dialog>

    );
}