import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1000,
    },
    avatar: {
        backgroundColor: red[500],
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export default function ProfileComponent({data}) {
    const classes = useStyles();
console.log(data)


   const latestPost =  data.notes.reduce((a, b) => {
        return new Date(a.createdAt) > new Date(b.createdAt) ? a : b;
    })


    const wasUpdated = new Date(latestPost.createdAt).getTime()=== new Date(latestPost.updatedAt).getTime()?false:true;

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {data.user.firstName.charAt(0)}
                    </Avatar>
                }
                title={data.user.firstName + " " + data.user.lastName}
                subheader={data.user._id}
            />
            <CardContent>
                <TableContainer >
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>E-Mail</TableCell>
                                <TableCell>{data.user.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Password</TableCell>
                                <TableCell>We don't know your password,here's your hash :) {data.user.password}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Dark Mode enabled?</TableCell>
                                <TableCell>{String(data.user.Darkmode)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Notes Number</TableCell>
                                <TableCell>{data.notes.length}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Verified</TableCell>
                                <TableCell>{data.user.isVerified?<DoneIcon/>:<ClearIcon/>}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Latest Post Title</TableCell>
                                <TableCell>{latestPost.title}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Latest Post Creation Date</TableCell>
                                <TableCell>{Date(latestPost.createdAt)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Latest Post Updated</TableCell>
                                <TableCell>{wasUpdated?`Was Updated (${Date(latestPost.updatedAt)}`:"Wasn't updated"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}