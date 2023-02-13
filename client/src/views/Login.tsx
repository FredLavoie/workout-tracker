import React, { useReducer, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import {
    AppBar,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    Snackbar,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { ServerError } from "../components/ServerError";
import { isAuthenticated, login } from "../services/authentication";
import { fetchAccountId } from "../services/fetchData";

// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={4} ref={ref} {...props} />;
});

type tLoginState = {
    username?: string;
    password?: string;
    showPassword?: boolean;
};

export function Login(): JSX.Element {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const [loginState, updateLoginState] = useReducer(
        (prev: tLoginState, next: tLoginState) => {
            return { ...prev, ...next };
        },
        { username: "", password: "", showPassword: false },
    );

    async function handleSubmit(event: { preventDefault: () => void }): Promise<void> {
        event.preventDefault();
        try {
            const data = await login(loginState.username, loginState.password);
            if (data.non_field_errors) {
                return setOpen(true);
            }
            try {
                await fetchAccountId();
                history.push("/dashboard");
            } catch (error) {
                return setError(error.message);
            }
        } catch (error) {
            return setError(error.message);
        }
    }

    // redirect to dashboard if already authenticated
    if (isAuthenticated() === true) {
        return <Redirect to="/dashboard" />;
    }

    function handleClose(): void {
        setOpen(false);
    }

    function handleClickShowPassword(): void {
        updateLoginState({ showPassword: !loginState.showPassword });
    }

    function handleMouseDownPassword(event): void {
        event.preventDefault();
    }

    return (
        <Paper elevation={0}>
            <AppBar sx={style.appBar} position="fixed" elevation={1}>
                <Toolbar>
                    <Typography variant="h5" display="block">
                        Workout Tracker
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "100vh" }}
            >
                <Grid item xs={12} md={3}>
                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <TextField
                            onChange={(e) => updateLoginState({ username: e.target.value })}
                            sx={style.textField}
                            label="Username"
                            variant="outlined"
                            value={loginState.username}
                            type={"input"}
                            name={"username"}
                            color="primary"
                        />
                        <FormControl sx={style.textField} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                onChange={(e) => updateLoginState({ password: e.target.value })}
                                value={loginState.password}
                                type={loginState.showPassword ? "input" : "password"}
                                name={"password"}
                                label="Password"
                                id="outlined-adornment-password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            size="large"
                                        >
                                            {loginState.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button
                            fullWidth
                            type={"submit"}
                            sx={style.btn}
                            color="primary"
                            variant="contained"
                            key={`${!loginState.username || !loginState.password ? true : false}`}
                            endIcon={<KeyboardArrowRightIcon />}
                            disabled={!loginState.username || !loginState.password ? true : false}
                        >
                            Login
                        </Button>
                    </Box>
                </Grid>
                {error && <ServerError errorMessage={error} />}
            </Grid>
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="error">Wrong username or password! Please try again.</Alert>
            </Snackbar>
        </Paper>
    );
}

const style = {
    appBar: {
        backgroundColor: "#673ab7", // prevent appBar color from changing with mode
        ["& .MuiToolbar-root"]: { minHeight: "56px" },
    },
    btn: {
        marginTop: "20px",
    },
    textField: {
        width: "100%",
        margin: "8px 0px",
    },
};
