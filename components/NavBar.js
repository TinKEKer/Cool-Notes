import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from 'next/link'
import {useContext} from "react";
import {Context} from "../utils/reducer/reducer";
import  axios from "axios";
import {useRouter} from "next/router";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useSnackbar } from 'notistack';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NoteIcon from '@material-ui/icons/Note';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import {axiosVar} from "../utils/axiosVar";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
        borderRadius: '50%',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    header:{
        flexGrow:1,
        textAlign:"center",

    },
    modeIcon:{
        transition:theme.transitions.create(['translate','transform'],{
            duration:theme.transitions.duration.shorter,
            easing: theme.transitions.easing.sharp
        }),
        "&:active":{
            transform: "scaleX(-1)",
        }
    }
}));


const Links = ['Profile', 'Notes','Create Note'];
const Icons = [<AccountCircleIcon/>,<NoteIcon/>,<NoteAddIcon/>]

export default function NavBar(props) {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [state,dispatch] = useContext(Context)

    const router = useRouter();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const updateMode = ()=>{
        axios.post(`${axiosVar}api/user`,{
            email:state.email,
            mode:state.darkMode
        }).then(data=>{
            console.log(data)
            dispatch({
            type:"Toggle mode"
        })
        console.log('done')
        }).catch(e=>console.log(e))
    }

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const logOut =  ()=>{
         axios.get(`${axiosVar}api/logout`).then(data=>{
             localStorage.clear()
             enqueueSnackbar(data.data.message,{
                 variant:'error'
             })
             router.push('/signin')}).catch(e=>console.log(e))
    }
    if(typeof window !== 'undefined'){
        console.log(localStorage.getItem('email'))
    }

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                color="primary"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >

                <Toolbar>
                    {typeof window !== 'undefined'&&localStorage.getItem('email')!==null?
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                        :null }
                    <Typography variant="h6" noWrap className={classes.header}>
                        Cool Notes
                    </Typography>
                    {typeof window !== 'undefined'&&localStorage.getItem('email')!==null?
                        <>
                    <IconButton
                        color="inherit"
                        aria-label="changeMode"
                       onClick={updateMode}
                        className={classes.modeIcon}
                    >
                        {state.darkMode?<Brightness2Icon/>:<WbSunnyIcon/>}

                    </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="logout"
                            onClick={logOut}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    </>
                    :null }
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {Links.map((text, index) => (
                        <Link  href={text==='Create Note'?'CreateNote':text} key={text}>
                        <ListItem button >

                            <ListItemIcon>{Icons[index]}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                        </Link>
                    ))}
                </List>
                <Divider />
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>
        </div>
    );
}
NavBar.getInitialProps=(ctx)=>{
    if(process.browser){
        console.log(localStorage)
    }
}