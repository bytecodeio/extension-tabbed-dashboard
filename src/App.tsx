import React, { useState } from 'react'
import { TabbedDash } from './TabbedDash'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

export const App: React.FC<{}> = hot(() => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
    setRoute(route)
    setRouteState(routeState)
  }


const theme = createTheme({
  palette: {
    primary: {
      main: "#607d8b",
      light: "#8eacbb",
      dark: "#34515e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#fafafa",
      light: "#ffffff",
      dark: "#c7c7c7",
      contrastText: "#37474f",
    },

    error: {
      main: "#D13630",
    },
  },
});

  return (
    <ExtensionProvider onRouteChange={onRouteChange}>
      <ThemeProvider theme={theme}>
      <TabbedDash route={route} routeState={routeState} />
        </ThemeProvider>
    </ExtensionProvider>
  )
})
