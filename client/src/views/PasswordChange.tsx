import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Snackbar,
    Typography
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { changePassword } from "../services/authentication";
import { validatePasswordChange } from "../utils";

// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={4} ref={ref} {...props} />;
});

export function Password() {
    const history = useHistory();
    const [newPassword1, changeNewPassword1] = useState("");
    const [newPassword2, changeNewPassword2] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault();
        const validatedInput = validatePasswordChange(newPassword1, newPassword2);
        if (!validatedInput) {
            setAlertMessage({ severity: "error", message: "The two passwords do not match or don't meet the requirements." });
            setOpenSnackbar(true);
            return;
        }
        try {
            await changePassword(newPassword1, newPassword2);
            history.push("/dashboard");
        } catch (error) {
            setAlertMessage({ severity: "error", message: error.message });
            return setOpenSnackbar(true);
        }
    }

    function handleClose() {
        setOpenSnackbar(false);
    }

    function handleClickShowPassword() {
        setShowPassword(!showPassword);
    }

    function handleMouseDownPassword(event) {
        event.preventDefault();
    }

    return (
        <Container>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={style.root}
            >
                <Typography variant="h4" gutterBottom>
          Password Reset
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
          Your password must contain at least 8 characters and cannot be entirely numeric.
                </Typography>
                <Grid item xs={12} md={3}>
                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <FormControl sx={style.textField} variant="outlined">
                            <OutlinedInput
                                onChange={(e) => changeNewPassword1(e.target.value)}
                                value={newPassword1}
                                type={showPassword ? "input" : "password"}
                                name="newPassword1"
                                color="secondary"
                                id="outlined-adornment-password"
                                data-testid="password"
                                placeholder="New password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl sx={style.textField} variant="outlined">
                            <OutlinedInput
                                onChange={(e) => changeNewPassword2(e.target.value)}
                                value={newPassword2}
                                type={showPassword ? "input" : "password"}
                                name="newPassword2"
                                color="secondary"
                                id="outlined-adornment-password2"
                                data-testid="password"
                                placeholder="New password (again)"
                            />
                        </FormControl>
                        <Button
                            fullWidth
                            type={"submit"}
                            sx={style.btn}
                            color="primary"
                            variant="contained"
                            key={`${!newPassword1 || !newPassword2 ? true : false}`}
                            disabled={!newPassword1 || !newPassword2 ? true : false}
                        >
              Change Password
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                {alertMessage && <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>}
            </Snackbar>
        </Container>
    );
}

const style = {
    root: {
        minHeight: "calc(100vh - 64px)"
    },
    btn: {
        marginTop: "20px",
    },
    textField: {
        width: "100%",
        margin: "8px 0px",
    },
};
