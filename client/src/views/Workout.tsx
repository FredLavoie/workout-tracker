import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { Box, Button, ButtonGroup, CircularProgress, Grid, Snackbar, Typography, TextField } from "@mui/material";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { fetchWorkout, postWorkout, updateWorkout, deleteWorkout } from "../services/fetchData";
import { useFetch } from "../hooks/useFetch";
import { convertTime, validateWorkout } from "../utils";
import { ServerError } from "../components/ServerError";

// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={4} ref={ref} {...props} />;
});

export function Workout() {
    const location = useLocation();
    const history = useHistory();

    const workoutId = location.pathname.split("/")[2];
    const newWorkoutDate = location.pathname.split("/")[3] || null;
    const newDate = new Date().toLocaleDateString("en-US").split("/");
    const currentDate = `${newDate[2]}-${newDate[0]?.padStart(2, "0")}-${newDate[1]?.padStart(2, "0")}`;
    const currentTime = convertTime(new Date().toTimeString().split(":").splice(0, 2));
    const navDate = `${newDate[2]}-${newDate[0].padStart(2, "0")}`;

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [selectedTime, setSelectedTime] = useState(currentTime);
    const [workoutBody, setWorkoutBody] = useState("");
    const [newOrEdit, changeNewOrEdit] = useState(1);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const { data, isLoading, error } = useFetch(fetchWorkout, { workoutId }, workoutId === "new");

    useEffect(() => {
        if (workoutId === "new") {
            setSelectedDate(newWorkoutDate !== null ? newWorkoutDate : currentDate);
            setSelectedTime(currentTime);
            setWorkoutBody("");
            changeNewOrEdit(1);
        } else if (data) {
            setSelectedDate(data.date);
            setSelectedTime(data.time.split(":").slice(0, 2).join(":"));
            setWorkoutBody(data.workout_body);
            changeNewOrEdit(0);
        }
    }, [data, isLoading, error]);

    async function handleSubmit(event: { preventDefault: () => void }) {
        event.preventDefault();

        if (workoutId === "new") {
            const valid = validateWorkout(selectedDate, selectedTime, workoutBody);
            if (valid) {
                try {
                    await postWorkout(selectedDate, selectedTime, workoutBody);
                    history.push(`/cal/${navDate}`);
                } catch (error) {
                    setAlertMessage({ severity: "error", message: error.message });
                    setOpenSnackbar(true);
                }
            } else {
                setAlertMessage({ severity: "error", message: "One or more inputted values is invalid." });
                setOpenSnackbar(true);
            }
        } else {
            const valid = validateWorkout(selectedDate, selectedTime, workoutBody);
            if (valid) {
                try {
                    await updateWorkout(workoutId, selectedDate, selectedTime, workoutBody);
                    history.push(`/cal/${navDate}`);
                } catch (error) {
                    setAlertMessage({ severity: "error", message: error.message });
                    setOpenSnackbar(true);
                }
            } else {
                setAlertMessage({ severity: "error", message: "One or more inputted values is invalid." });
                setOpenSnackbar(true);
            }
        }
    }

    function handleCancel() {
        history.goBack();
    }

    async function handleDelete() {
        try {
            await deleteWorkout(workoutId);
            history.push(`/cal/${navDate}`);
        } catch (error) {
            setAlertMessage({ severity: "error", message: error.message });
            setOpenSnackbar(true);
        }
    }

    function handleClose() {
        setOpenSnackbar(false);
    }

    return (
        <Grid container direction="column" alignItems="center" sx={style.root}>
            <Typography variant="h4" gutterBottom>
                Workout
            </Typography>
            {error && <ServerError errorMessage={error} />}
            {isLoading && <CircularProgress />}
            {!error && !isLoading && (
                <Grid sx={style.formSize}>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={style.formContainer}>
                        <Typography sx={style.labelStyle}>Date</Typography>
                        <TextField
                            onChange={(e) => setSelectedDate(e.target.value)}
                            margin="normal"
                            placeholder="Date"
                            id="date-picker"
                            value={selectedDate}
                        />
                        <Typography sx={style.labelStyle}>Time</Typography>
                        <TextField
                            onChange={(e) => setSelectedTime(e.target.value)}
                            margin="normal"
                            placeholder="Time"
                            id="time-picker"
                            value={selectedTime}
                        />
                        <Typography sx={style.labelStyle}>Workout</Typography>
                        {workoutBody === "" ? (
                            <TextField
                                onChange={(e) => setWorkoutBody(e.target.value)}
                                sx={style.field}
                                id="workout-body"
                                placeholder="Workout body"
                                multiline
                                rows={10}
                                value=""
                                variant="outlined"
                            />
                        ) : (
                            <TextField
                                onChange={(e) => setWorkoutBody(e.target.value)}
                                sx={style.field}
                                id="workout-body"
                                multiline
                                rows={10}
                                defaultValue={workoutBody}
                                variant="outlined"
                            />
                        )}
                        <Button
                            fullWidth
                            type={"submit"}
                            sx={style.btn}
                            color="primary"
                            variant="contained"
                            key={`${!workoutBody ? true : false}`}
                            disabled={!workoutBody ? true : false}
                        >
                            Save
                        </Button>
                        {newOrEdit === 1 ? (
                            <Button onClick={handleCancel} sx={style.btn} variant="outlined">
                                Cancel
                            </Button>
                        ) : (
                            <ButtonGroup fullWidth sx={style.btnGrp}>
                                <Button onClick={handleCancel}>Go Back</Button>
                                <Button onClick={handleDelete}>Delete</Button>
                            </ButtonGroup>
                        )}
                    </Box>
                </Grid>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {alertMessage && <Alert severity={alertMessage.severity}>{alertMessage.message}</Alert>}
            </Snackbar>
        </Grid>
    );
}

const style = {
    root: {
        minHeight: "calc(100vh - 96px)",
        marginBottom: "32px",
        marginTop: "16px",
    },
    field: {
        margin: "16px 0 16px 0",
    },
    btn: {
        marginTop: "16px",
    },
    btnGrp: {
        marginTop: "16px",
    },
    formSize: {
        width: { sm: "65%", xs: "90%" },
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        margin: "auto",
    },
    labelStyle: {
        marginTop: "16px",
    },
};
