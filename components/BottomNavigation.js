import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {useContext} from "react";
import {Context} from "../utils/reducer/reducer";
import UpdateIcon from '@material-ui/icons/Update';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles({
    root: {
        width: '100%',
        position:'fixed',
        bottom:'0',
        top:'auto',
        marginLeft:'-25px',
    },
});

export default function BottomNav({children}) {
    const classes = useStyles();
    const [value, setValue] = React.useState('');

    const [state,dispatch] = useContext(Context)

    const handleChange = (event, newValue) => {
        setValue(newValue);
        dispatch({
            type:'Sort Type',
            payload:newValue
        })
    };

    return (
        <>
            {children}
        <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
            <BottomNavigationAction label="Custom Sorting" value="" icon={<FaceIcon />} />
            <BottomNavigationAction label="Favorites" value="liked desc" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Latest" value="createdAt desc" icon={<UpdateIcon />} />
            <BottomNavigationAction label="Oldest" value="createdAt asc" icon={<RestoreIcon />} />
        </BottomNavigation>
            </>
    );
}