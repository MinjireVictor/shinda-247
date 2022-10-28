import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Transactions from "./Transactions";
import Deposit from "./Deposit";
import Withdrawl from "./Withdrawl";
import History from "./History";
import { useLocation } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

function Wallet(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { state } = useLocation();
  const idx = state?.index || 0;
  const [value, setValue] = React.useState(idx);
  const { route } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" backgroun="transparent">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          variant="fullWidth"
          aria-label="full width tabs"
          centered
        >
          <Tab label="Transactions" {...a11yProps(0)} />
          <Tab label="Deposit" {...a11yProps(1)} />
          <Tab label="Withdrawal" {...a11yProps(2)} />
          <Tab label="History" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Transactions />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Deposit />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Withdrawl />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <History />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

export default Wallet;
