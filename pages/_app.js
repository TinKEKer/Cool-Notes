import React, {useMemo, useReducer} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import NavBar from "../components/NavBar";
import {reducer, initialState, Context} from '../utils/reducer/reducer'
import {SnackbarProvider} from "notistack";
import {blue, deepPurple, red} from "@material-ui/core/colors";
import NextNProgress from "nextjs-progressbar";
import 'react-calendar-heatmap/dist/styles.css';


export default function MyApp(props) {
    const { Component, pageProps } = props;

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const [state,dispatch] = useReducer(reducer,initialState);

    const palletType = state.darkMode?'dark':'light'
    const mainPrimaryColor = state.darkMode?deepPurple[300]:blue[900];
    const mainSecondaryColor = state.darkMode?deepPurple[200]:blue[500];


    const Darktheme = useMemo(
        ()=> createMuiTheme({
        palette: {
            type:palletType,
            primary: {
                main:mainPrimaryColor
            },
            secondary: {
                main:mainSecondaryColor
            },
            contrastThreshold: 3,
            tonalOffset: 0.4,
        },

            overrides: {
                MuiInputBase: {
                    root: {
                        "& input": {
                            "&:-webkit-autofill": {
                                transition:
                                    "background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s",
                            },
                            "&:-webkit-autofill:focus": {
                                transition:
                                    "background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s",
                            },
                            "&:-webkit-autofill:hover": {
                                transition:
                                    "background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s",
                            },
                        },
                    },
                },
                MuiCssBaseline: {
                    '@global': {
                        body: {
                            transition: 'background-color 0.4s ease-out',
                        },
                    },
                },
            },

    }),[state.darkMode]
    )






    return (
        <>
            <ThemeProvider theme={Darktheme}>
            <NextNProgress
                color="#32a862"
                height="6"
                options={
                    { easing: 'ease', speed: 100 }
                }
            />
            <Head>
                <title>My page</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <Context.Provider value={[state,dispatch]}>
                <CssBaseline />
                <SnackbarProvider anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}>
                <NavBar>
                <Component {...pageProps} />
                </NavBar>
                </SnackbarProvider>
            </Context.Provider>
            </ThemeProvider>
            </>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};

