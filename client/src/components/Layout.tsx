import React, { useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";

import {
    AppBar,
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Toolbar,
    Snackbar,
    Switch,
    Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import TodayIcon from "@mui/icons-material/Today";
import ViewDayIcon from "@mui/icons-material/ViewDay";

import { useTheme } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { logout, isAuthenticated } from "../services/authentication";

// eslint-disable-next-line prefer-arrow-callback
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={4} ref={ref} {...props} />;
});

export function Layout({ children, userTheme, setUserTheme }): JSX.Element {
    if (isAuthenticated() === false) {
        return <Redirect to="/login" />;
    }

    // dateArray example: Jan 31, 2020 -> ["1", "31", "2020"]
    const dateArray: string[] = new Date().toLocaleDateString("en-US").split("/");
    const calPath = `/cal/${dateArray[2]}-${dateArray[0].padStart(2, "0")}`;

    const history = useHistory();
    const location = useLocation();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const username = localStorage.getItem("username");
    const firstTwoLetter = `${username[0].toUpperCase()}${username[1].toUpperCase()}`;

    async function handleSubmit(event: { preventDefault: () => void }): Promise<void> {
        event.preventDefault();
        try {
            await logout();
            history.push("/login");
        } catch (error) {
            return setOpenSnackbar(true);
        }
    }

    function handleCloseError(): void {
        setOpenSnackbar(false);
    }

    function handleClickAvatar(event: { currentTarget: any }): void {
        setAnchorEl(event.currentTarget);
    }

    function handleClose(): void {
        setAnchorEl(null);
    }

    function handleDrawerToggle(): void {
        setMobileOpen(!mobileOpen);
    }

    function handleMenuItemClick(path: string): void {
        if (mobileOpen) handleDrawerToggle();
        history.push(path);
    }

    function handleChangePasswordClick(): void {
        handleClose();
        history.push("/password-change");
    }

    function handleThemeToggle(event): void {
        if (event.target.checked) {
            localStorage.setItem("userTheme", "dark");
            setUserTheme("dark");
        } else {
            localStorage.setItem("userTheme", "light");
            setUserTheme("light");
        }
    }

    const drawer = (
        <List>
            <ListItem
                onClick={() => handleMenuItemClick("/dashboard")}
                sx={
                    location.pathname === "/dashboard"
                        ? userTheme === "light"
                            ? style.activeLight
                            : style.activeDark
                        : style.listItem
                }
            >
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
                onClick={() => handleMenuItemClick(calPath)}
                sx={
                    location.pathname.includes("/cal/")
                        ? userTheme === "light"
                            ? style.activeLight
                            : style.activeDark
                        : style.listItem
                }
            >
                <ListItemIcon>
                    <TodayIcon />
                </ListItemIcon>
                <ListItemText primary="Calendar" />
            </ListItem>
            <ListItem
                onClick={() => handleMenuItemClick("/week")}
                sx={
                    location.pathname.includes("/week")
                        ? userTheme === "light"
                            ? style.activeLight
                            : style.activeDark
                        : style.listItem
                }
            >
                <ListItemIcon>
                    <ViewDayIcon />
                </ListItemIcon>
                <ListItemText primary="Week" />
            </ListItem>
            <ListItem
                onClick={() => handleMenuItemClick("/search")}
                sx={
                    location.pathname === "/search"
                        ? userTheme === "light"
                            ? style.activeLight
                            : style.activeDark
                        : style.listItem
                }
            >
                <ListItemIcon>
                    <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Search" />
            </ListItem>
            <Divider />
            <ListItem
                onClick={() => handleMenuItemClick("/workouts/new")}
                sx={
                    location.pathname === "/workouts/new"
                        ? userTheme === "light"
                            ? style.activeLight
                            : style.activeDark
                        : style.listItem
                }
            >
                <ListItemIcon>
                    <FitnessCenterIcon />
                </ListItemIcon>
                <ListItemText primary="New Workout" />
            </ListItem>
            <ListItem
                onClick={() => handleMenuItemClick("/records/new")}
                sx={
                    location.pathname === "/records/new"
                        ? userTheme === "light"
                            ? style.activeLight
                            : style.activeDark
                        : style.listItem
                }
            >
                <ListItemIcon>
                    <StarIcon />
                </ListItemIcon>
                <ListItemText primary="New PR" />
            </ListItem>
        </List>
    );

    return (
        <Paper elevation={0} sx={style.root1}>
            {/*********************************** Navbar ************************************/}
            <AppBar position="fixed" elevation={1} sx={style.root2}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={style.menuButton}
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" sx={style.title}>
                        Workout Tracker
                    </Typography>

                    <Button onClick={handleClickAvatar}>
                        <Avatar sx={style.avatar} aria-controls="simple-menu" aria-haspopup="true">
                            {firstTwoLetter}
                        </Avatar>
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleChangePasswordClick}>Change Password</MenuItem>
                        <MenuItem onClick={handleSubmit}>Logout</MenuItem>
                        <MenuItem onChange={handleThemeToggle}>
                            <FormControlLabel
                                sx={style.modeToggle}
                                labelPlacement="start"
                                control={<Switch checked={userTheme === "dark" ? true : false} />}
                                label="Dark Mode"
                            />
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/*********************** Mobile drawer - toggle left ***************************/}
            <Drawer
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={style.mobileDrawer}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>

            {/******************** Desktop drawer - permanent left **************************/}
            <Drawer sx={style.desktopDrawer} variant="permanent" anchor="left">
                {drawer}
            </Drawer>

            {/*********************************** Content ***********************************/}
            <Box sx={style.page}>
                {/* this element adds margin to push content below the appbar */}
                <Box sx={style.toolbarMargin} />
                {children}
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="error">Server error</Alert>
            </Snackbar>
        </Paper>
    );
}

const drawerWidth = "200px";
const style = {
    page: {
        width: "100%",
        minHeight: "100vh",
        height: "100%",
    },
    root1: {
        display: "flex",
        borderRadius: "0",
    },
    root2: {
        flexGrow: "1",
        height: "56px",
        zIndex: "1250",
        backgroundColor: "#673ab7", // prevent appBar color from changing with mode
        ["& .MuiToolbar-root"]: { minHeight: "56px" },
    },
    mobileDrawer: {
        width: drawerWidth,
        zIndex: "1300",
        display: { sm: "none", xs: "block" },
    },
    desktopDrawer: {
        width: drawerWidth,
        ["& .MuiDrawer-paper"]: { width: drawerWidth, paddingTop: "56px" },
        display: { sm: "block", xs: "none" },
    },
    activeDark: {
        cursor: "pointer",
        background: "#252525",
    },
    activeLight: {
        cursor: "pointer",
        background: "#f4f4f4",
    },
    listItem: {
        cursor: "pointer",
        "&:hover": {
            opacity: "0.75",
            background: "#673ab7",
        },
    },
    toolbarMargin: {
        height: "56px",
    },
    logoutButton: {
        color: "secondary.main",
    },
    avatar: {
        backgroundColor: "secondary.main",
        color: "#212121",
    },
    menuButton: {
        color: "secondary.main",
        marginRight: "16px",
        display: { sm: "none" },
    },
    title: {
        flexGrow: "1",
    },
    modeToggle: {
        marginLeft: "0",
    },
};
