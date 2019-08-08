import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  Menu
} from "@material-ui/core";

import BloomEmbed from "./BloomEmbed";

const styles = theme => ({
  root: {
    // maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto",
    height: "100%"
  },
  table: {
    minWidth: 200
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300
  },
  container: {
    height: "100%"
  },
  formContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: `${theme.spacing.unit * 3}px`
  },
  menuButton: {
    minWidth: 200
  }
});

class CaseList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      caseId: "",
      order: "asc",
      orderBy: "last_name",
      page: 0,
      rowsPerPage: 10,
      usernameFilter: "",
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = event => {
    console.log(event.target.bloomURL);

    this.setState({ anchorEl: null });
  };

  handleChange = name => event => {
    console.log(name);
    console.log(event);
    console.log(event.nativeEvent.target.getAttribute("bloomurl"));

    if (name === "caseId") {
      this.setState({
        caseId: event.target.value,
        bloomURL: event.nativeEvent.target.getAttribute("bloomurl")
      });
    } else {
      this.setState({
        [name]: event.target.value
      });
    }
  };

  handleSortRequest = property => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  getFilter = () => {
    return this.state.usernameFilter.length > 0
      ? { last_name_contains: this.state.usernameFilter }
      : {};
  };

  handleFilterChange = filterName => event => {
    const val = event.target.value;

    this.setState({
      [filterName]: val
    });
  };

  render() {
    const { order, orderBy } = this.state;
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Typography variant="h2" gutterBottom>
          Case List
        </Typography>

        <Query
          query={gql`
            {
              getAllCases {
                caseId
                bloomURL
              }
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            return (
              <div className={this.props.classes.container}>
                <form className={classes.formContainer}>
                  <TextField
                    id="caselist-select"
                    select
                    label="Select Case"
                    className={classes.textField}
                    value={this.state.caseId}
                    onChange={this.handleChange("caseId")}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                    helperText="Please select a case"
                    margin="normal"
                    variant="outlined"
                  >
                    {data.getAllCases.map(option => (
                      <MenuItem
                        key={option.caseId}
                        value={option.caseId}
                        bloomurl={option.bloomURL}
                      >
                        {option.caseId}
                      </MenuItem>
                    ))}
                  </TextField>
                  <div>
                    <Button
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={this.handleClick}
                      className={classes.menuButton}
                    >
                      Adjudicate Case
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={this.state.anchorEl}
                      keepMounted
                      open={Boolean(this.state.anchorEl)}
                      onClose={this.handleClose}
                    >
                      <MenuItem onClick={this.handleClose}>Fraud</MenuItem>
                      <MenuItem onClick={this.handleClose}>Not Fraud</MenuItem>
                    </Menu>
                  </div>
                </form>
                <Grid
                  container
                  spacing={2}
                  className={this.props.classes.container}
                >
                  <Grid item xs={12}>
                    <BloomEmbed bloomURL={this.state.bloomURL} />
                  </Grid>
                </Grid>
              </div>
            );
          }}
        </Query>
      </Paper>
    );
  }
}

export default withStyles(styles)(CaseList);
