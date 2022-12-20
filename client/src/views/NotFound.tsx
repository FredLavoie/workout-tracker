import React from "react";

import {
    AppBar,
    Container,
    Toolbar,
    Typography
} from "@mui/material";


export function NotFound() {
    return (
        <Container>
            <AppBar sx={style.appBar} position='fixed' elevation={1}>
                <Toolbar>
                    <Typography variant='h5' display='block'>
            Workout Tracker
                    </Typography>
                </Toolbar>
            </AppBar>
            <Typography variant='h4' align='center'>
                <br />
        404 - Resource not found
            </Typography>
        </Container>
    );
}

const style = {
    appBar: {
        backgroundColor: "#673ab7", // prevent appBar color from changing with mode
        ["& .MuiToolbar-root"]: { minHeight: "56px" },
    },
};
