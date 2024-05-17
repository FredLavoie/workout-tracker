import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    FormControlLabel,
    Grid,
    MenuItem,
    Select,
    Snackbar,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { fetchRecord, updateRecord, postRecord, deleteRecord, fetchRecordList } from "../services/fetchData";
import { validateRecord } from "../utils";
import { ServerError } from "../components/ServerError";

// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={4} ref={ref} {...props} />;
});

type tRecordState = {
    selectedDate?: string;
    recordType?: string;
    recordEvent?: string;
    recordScore?: string;
    newOrEdit?: number;
};

export function Record() {
    const location = useLocation();
    const navigate = useNavigate();

    const recordId = location.pathname.split("/")[2];
    const newDate = new Date().toLocaleDateString("en-US").split("/");
    const currentDate = `${newDate[2]}-${newDate[0]?.padStart(2, "0")}-${newDate[1]?.padStart(2, "0")}`;

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const [recordState, updateRecordState] = useReducer(
        (prev: tRecordState, next: tRecordState) => {
            return { ...prev, ...next };
        },
        { selectedDate: currentDate, recordType: "strength", recordEvent: "", recordScore: "", newOrEdit: 1 },
    );

    const { data, isLoading, error } = useFetchRecordData(recordId, recordId === "new");

    useEffect(() => {
        if (recordId === "new") {
            updateRecordState({
                selectedDate: currentDate,
                recordType: "strength",
                recordEvent: "",
                recordScore: "",
                newOrEdit: 1,
            });
        } else if (data) {
            updateRecordState({
                selectedDate: data.recordData.date,
                recordType: data.recordData.type,
                recordEvent: data.recordData.event,
                recordScore: data.recordData.score,
                newOrEdit: 0,
            });
        }
    }, [data, recordId]);

    async function handleSubmit(event: { preventDefault: () => void }): Promise<void> {
        event.preventDefault();

        const valid = validateRecord(
            recordState.selectedDate,
            recordState.recordType,
            recordState.recordEvent,
            recordState.recordScore,
            data.eventList,
        );
        if (valid) {
            try {
                if (recordId === "new") {
                    await postRecord(
                        recordState.selectedDate,
                        recordState.recordType,
                        recordState.recordEvent,
                        recordState.recordScore,
                    );
                } else {
                    await updateRecord(
                        recordId,
                        recordState.selectedDate,
                        recordState.recordType,
                        recordState.recordEvent,
                        recordState.recordScore,
                    );
                }
                navigate("/dashboard");
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
        navigate("/dashboard");
    }

    async function handleDelete(): Promise<void> {
        try {
            await deleteRecord(recordId);
            navigate("/dashboard");
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
                Personal Record
            </Typography>
            {error && <ServerError errorMessage={error} />}
            {isLoading && <CircularProgress />}
            {!error && !isLoading && data && (
                <Grid sx={style.formSize}>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={style.formContainer}>
                        <Typography sx={style.elementMargin}>Date</Typography>
                        <TextField
                            onChange={(e) => updateRecordState({ selectedDate: e.target.value })}
                            margin="normal"
                            placeholder="Date"
                            id="date-picker"
                            type="date"
                            value={recordState.selectedDate}
                        />
                        <Typography sx={style.elementMargin}>Event Type</Typography>
                        <RadioGroup
                            row
                            name="recordType"
                            value={recordState.recordType}
                            sx={style.elementMargin}
                            onChange={(e) => updateRecordState({ recordType: e.target.value })}
                        >
                            <FormControlLabel value="strength" control={<Radio color="primary" />} label="Strength" />
                            <FormControlLabel value="endurance" control={<Radio color="primary" />} label="Endurance" />
                            <FormControlLabel value="wod" control={<Radio color="primary" />} label="WOD" />
                        </RadioGroup>
                        <Typography sx={style.elementMargin}>Event</Typography>
                        <Select
                            onChange={(e) => updateRecordState({ recordEvent: e.target.value })}
                            sx={style.elementMargin}
                            id="record-event"
                            value={recordState.recordEvent}
                        >
                            {data?.eventList[recordState?.recordType]?.map((ea: string, index: React.Key) => (
                                <MenuItem data-testid="event-option" key={index} value={ea}>
                                    {ea}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography sx={style.elementMargin}>Score</Typography>
                        <TextField
                            onChange={(e) => updateRecordState({ recordScore: e.target.value })}
                            sx={style.elementMargin}
                            placeholder="Score"
                            id="record-score"
                            value={recordState.recordScore}
                        />
                        <Button
                            fullWidth
                            type={"submit"}
                            sx={style.elementMargin}
                            color="primary"
                            variant="contained"
                            key={`${
                                !recordState.selectedDate || !recordState.recordEvent || !recordState.recordScore
                                    ? true
                                    : false
                            }`}
                            disabled={
                                !recordState.selectedDate || !recordState.recordEvent || !recordState.recordScore
                                    ? true
                                    : false
                            }
                        >
                            Save
                        </Button>
                        {recordState.newOrEdit === 1 ? (
                            <Button onClick={handleCancel} sx={style.elementMargin} variant="outlined">
                                Cancel
                            </Button>
                        ) : (
                            <ButtonGroup fullWidth sx={style.elementMargin}>
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

/**
 * Custom hook to abstract the data fetching for the Record view
 *
 * @param recordId
 * @returns {object}
 */
function useFetchRecordData(recordId: string, skip: boolean): Record<string, any> {
    const [response, updateResponse] = useReducer(
        (prev: any, next: any) => {
            return { ...prev, ...next };
        },
        { data: null, isLoading: false, error: null },
    );

    useEffect(() => {
        const abortCont = new AbortController();
        const setupPage = async (): Promise<void> => {
            try {
                updateResponse({ isLoading: true });

                const recordData = skip ? {} : await fetchRecord(recordId, abortCont);
                const eventList = await fetchRecordList(abortCont);

                updateResponse({ data: { recordData, eventList }, isLoading: false });
            } catch (error) {
                if (error.name === "AbortError") return;
                updateResponse({ error: error.message, isLoading: false });
            }
        };
        setupPage();
        return () => abortCont.abort();
    }, []);

    return response;
}

const style = {
    root: {
        minHeight: "calc(100vh - 96px)",
        marginBottom: "32px",
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
    elementMargin: {
        marginTop: "16px",
    },
};
