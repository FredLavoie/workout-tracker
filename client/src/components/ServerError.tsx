import React from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function ServerError({ errorMessage }) {
    return (
        <Container>
            <Typography variant='h4' align='center'>
                <br />
                {errorMessage}
            </Typography>
        </Container>
    );
}
