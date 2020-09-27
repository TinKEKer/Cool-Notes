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
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import dynamic from 'next/dynamic';
import ReactTooltip from "react-tooltip";

 const CalendarHeatmap=dynamic(import('react-calendar-heatmap'),{ssr:false})



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1000,
        transition: 'background-color 0.2s ease-out',
    },
    avatar: {
        backgroundColor: red[500],
        width: theme.spacing(7),
        height: theme.spacing(7),
    }
}));

export default function ProfileComponent({data}) {
    const classes = useStyles();

    // const config = {
    //     theme: 'blue',
    //     width: 40,
    //     height: 10,
    //     boxSize: 20,
    //     isLineChart: false,
    //     bordered: false
    // };

console.log(data)

let ChartData=[];
if(data.notes.length!==0){
    const tempData = data.notes.slice()
    for(let i = 0;i<tempData.length;i++) {
        var tempCreated = new Date(tempData[i].createdAt).toLocaleDateString("en-Us", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        let counter = 0;
        var details=[];
        for (let j = 0; j < tempData.length; j++) {
            if (tempCreated == new Date(tempData[j].createdAt).toLocaleDateString("en-Us", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })) {
                counter++
                tempData.slice(j, 1);
            }
        }
        ChartData.push({
            date: tempCreated,
            count: counter,
        })
    }
ChartData= ChartData.reduce(
    (accumulator, current) => accumulator.some(x => x.date === current.date)? accumulator: [...accumulator, current ], []
)
    console.log(ChartData)
    }



   const latestPost = data.notes.length!==0?data.notes.reduce((a, b) => {
        return new Date(a.createdAt) > new Date(b.createdAt) ? a : b;
    }):false


    const wasUpdated = !latestPost?null:new Date(latestPost.createdAt).getTime()=== new Date(latestPost.updatedAt).getTime()?false:true;

    return (
        <Grid>
            <Grid>
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
                                <TableCell>Verified</TableCell>
                                <TableCell>{data.user.isVerified?<DoneIcon/>:<ClearIcon/>}</TableCell>
                            </TableRow>
                            {data.notes.length!==0?<>
                            <TableRow>
                                <TableCell>Notes Number</TableCell>
                                <TableCell>{data.notes.length}</TableCell>
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
                              </>  :null}
                        </TableBody>
                    </Table>
                </TableContainer>
                {data.notes.length!==0&&ChartData!==[]?
                    <div>
                    <CalendarHeatmap
                         showWeekdayLabels={true}
                        values={ChartData}
                         tooltipDataAttrs={value =>
                             value.count!==null&&value.date!==null?{
                                 'data-tip': `${value.date} , ${
                                     value.count
                                 } Notes were created`,
                             }:null
                         }
                         classForValue={value => {
                             if (!value) {
                                 return 'color-empty';
                             }
                             return `color-gitlab-${Math.ceil((value.count/100)*10)}`;
                         }}
                    />
                        <ReactTooltip  />
                                         </div>
                    :null}
            </CardContent>
        </Card>
            </Grid>
            </Grid>
    );
}
