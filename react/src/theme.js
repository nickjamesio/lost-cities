import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";
import green from "@material-ui/core/colors/green";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000000"
    },
    secondary: {
      main: green[800]
    }
  }
});

function CustomTheme({children}) {
    return (
      <MuiThemeProvider theme={theme}>
          {children}
      </MuiThemeProvider>
    );
  }
  
  export default CustomTheme;
