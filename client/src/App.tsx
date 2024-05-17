import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider, StyledEngineProvider, PaletteMode } from "@mui/material";
import { Layout } from "./components/Layout";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Dashboard } from "./views/Dashboard";
import { Workout } from "./views/Workout";
import { Record } from "./views/Record";
import { DetailRecord } from "./views/DetailRecord";
import { Calendar } from "./views/Calendar";
import { Search } from "./views/Search";
import { Week } from "./views/Week";
import { Password } from "./views/PasswordChange";
import { NotFound } from "./views/NotFound";
import "./App.css";

export function App() {
    const [userTheme, setUserTheme] = useState(localStorage.getItem("userTheme") ?? "light");

    const myTheme = createTheme({
        palette: {
            mode: userTheme as PaletteMode,
            primary: {
                main: "#673ab7",
            },
            secondary: {
                main: "#1de9b6",
            },
        },
    });

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={myTheme}>
                <Router>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Layout userTheme={userTheme} setUserTheme={setUserTheme} />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/workouts/new" element={<Workout />} />
                            <Route path="/workouts/:id" element={<Workout />} />
                            <Route path="/records/event/:event" element={<DetailRecord />} />
                            <Route path="/records/new" element={<Record />} />
                            <Route path="/records/:id" element={<Record />} />
                            <Route path="/cal/:date" element={<Calendar />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/password-change" element={<Password />} />
                            <Route path="/week" element={<Week />} />
                            <Route path="/404" element={<NotFound />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
