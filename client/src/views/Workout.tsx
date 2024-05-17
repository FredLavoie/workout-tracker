import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

type tWorkoutState = {
    selectedDate?: string;
    selectedTime?: string;
    workoutBody?: string;
    newOrEdit?: number;
};

export function Workout() {
    const location = useLocation();
    const navigate = useNavigate();

    const workoutId = location.pathname.split("/")[2];
    const newWorkoutDate = location.pathname.split("/")[3] || null;
    const newDate = new Date().toLocaleDateString("en-US").split("/");
    const currentDate = `${newDate[2]}-${newDate[0]?.padStart(2, "0")}-${newDate[1]?.padStart(2, "0")}`;
    const currentTime = convertTime(new Date().toTimeString().split(":").splice(0, 2));
    const navDate = `${newDate[2]}-${newDate[0].padStart(2, "0")}`;

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const [workoutState, updateWorkoutState] = useReducer(
        (prev: tWorkoutState, next: tWorkoutState) => {
            return { ...prev, ...next };
        },
        { selectedDate: currentDate, selectedTime: currentTime, workoutBody: "", newOrEdit: 1 },
    );

    const { data, isLoading, error } = useFetch(fetchWorkout, { workoutId }, workoutId === "new");

    useEffect(() => {
        if (workoutId === "new") {
            const newDate = newWorkoutDate !== null ? newWorkoutDate : currentDate;
            updateWorkoutState({ selectedDate: newDate, selectedTime: currentTime, workoutBody: "", newOrEdit: 1 });
        } else if (data) {
            updateWorkoutState({
                selectedDate: data.date,
                selectedTime: data.time.split(":").slice(0, 2).join(":"),
                workoutBody: data.workout_body,
                newOrEdit: 0,
            });
        }
    }, [data, workoutId]);

    async function handleSubmit(event: { preventDefault: () => void }): Promise<void> {
        event.preventDefault();
        const valid = validateWorkout(workoutState.selectedDate, workoutState.selectedTime, workoutState.workoutBody);

        if (valid) {
            try {
                if (workoutId === "new") {
                    await postWorkout(workoutState.selectedDate, workoutState.selectedTime, workoutState.workoutBody);
                } else {
                    await updateWorkout(
                        workoutId,
                        workoutState.selectedDate,
                        workoutState.selectedTime,
                        workoutState.workoutBody,
                    );
                }
                navigate(`/cal/${navDate}`);
            } catch (error) {
                setAlertMessage({ severity: "error", message: error.message });
                setOpenSnackbar(true);
            }
        } else {
            setAlertMessage({ severity: "error", message: "One or more inputted values is invalid." });
            setOpenSnackbar(true);
        }
    }

    function handleCancel(): void {
        navigate(`/cal/${navDate}`);
    }

    async function handleDelete(): Promise<void> {
        try {
            await deleteWorkout(workoutId);
            navigate(`/cal/${navDate}`);
        } catch (error) {
            setAlertMessage({ severity: "error", message: error.message });
            setOpenSnackbar(true);
        }
    }

    function handleClose(): void {
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
                            onChange={(e) => updateWorkoutState({ selectedDate: e.target.value })}
                            margin="normal"
                            placeholder="Date"
                            id="date-picker"
                            type="date"
                            value={workoutState.selectedDate}
                        />
                        <Typography sx={style.labelStyle}>Time</Typography>
                        <TextField
                            onChange={(e) => updateWorkoutState({ selectedTime: e.target.value })}
                            margin="normal"
                            placeholder="Time"
                            id="time-picker"
                            type="time"
                            value={workoutState.selectedTime}
                        />
                        <Typography sx={style.labelStyle}>Workout</Typography>
                        {workoutState.workoutBody === "" ? (
                            <TextField
                                onChange={(e) => updateWorkoutState({ workoutBody: e.target.value })}
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
                                onChange={(e) => updateWorkoutState({ workoutBody: e.target.value })}
                                sx={style.field}
                                id="workout-body"
                                multiline
                                rows={10}
                                defaultValue={workoutState.workoutBody}
                                variant="outlined"
                            />
                        )}
                        <Button
                            fullWidth
                            type={"submit"}
                            sx={style.btn}
                            color="primary"
                            variant="contained"
                            key={`${!workoutState.workoutBody ? true : false}`}
                            disabled={!workoutState.workoutBody ? true : false}
                        >
                            Save
                        </Button>
                        {workoutState.newOrEdit === 1 ? (
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
