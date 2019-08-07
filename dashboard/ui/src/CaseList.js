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
  MenuItem
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
  }
});

class CaseList extends React.Component {
  constructor(props) {
    super(props);

    this.BLOOM_BASE_URL =
      process.env.REACT_APP_BLOOM_BASE_URL ||
      "http://localhost:7474/browser/bloom/";

    this.state = {
      caseId: "",
      order: "asc",
      orderBy: "last_name",
      page: 0,
      rowsPerPage: 10,
      usernameFilter: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
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
              getAllCases
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            return (
              <div className={this.props.classes.container}>
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
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <Query
                  query={gql`
                    query usersPaginateQuery(
                      $first: Int
                      $offset: Int
                      $caseId: String
                      $orderBy: [_PartyOrdering]
                      $filter: _PartyFilter
                    ) {
                      Party(
                        case_id: $caseId
                        first: $first
                        offset: $offset
                        orderBy: $orderBy
                        filter: $filter
                      ) {
                        last_name
                        first_name
                        louvainCommunity
                        occupation
                        sharedIdentitySize
                        bloomURL
                      }
                    }
                  `}
                  variables={{
                    first: this.state.rowsPerPage,
                    offset: this.state.rowsPerPage * this.state.page,
                    orderBy: this.state.orderBy + "_" + this.state.order,
                    caseId: this.state.caseId,
                    filter: this.getFilter()
                  }}
                >
                  {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error</p>;

                    return (
                      <Grid
                        container
                        spacing={2}
                        className={this.props.classes.container}
                      >
                        <Grid item xs={9}>
                          <BloomEmbed
                            bloomURL={`${this.BLOOM_BASE_URL}?perspective=Fraud&search=View+Case+${this.state.caseId}`}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Table className={this.props.classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  key="last_name"
                                  sortDirection={
                                    orderBy === "last_name" ? order : false
                                  }
                                >
                                  <Tooltip
                                    title="Sort"
                                    placement="bottom-start"
                                    enterDelay={300}
                                  >
                                    <TableSortLabel
                                      active={orderBy === "last_name"}
                                      direction={order}
                                      onClick={() =>
                                        this.handleSortRequest("last_name")
                                      }
                                    >
                                      Last Name
                                    </TableSortLabel>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  key="louvainCommunity"
                                  sortDirection={
                                    orderBy === "louvainCommunity"
                                      ? order
                                      : false
                                  }
                                  numeric
                                >
                                  <Tooltip
                                    title="Sort"
                                    placement="bottom-end"
                                    enterDelay={300}
                                  >
                                    <TableSortLabel
                                      active={orderBy === "louvainCommunity"}
                                      direction={order}
                                      onClick={() =>
                                        this.handleSortRequest(
                                          "louvainCommunity"
                                        )
                                      }
                                    >
                                      Louvain Community
                                    </TableSortLabel>
                                  </Tooltip>
                                </TableCell>
                                <TableCell
                                  key="sharedIdentitySize"
                                  sortDirection={
                                    orderBy === "sharedIdentitySize"
                                      ? order
                                      : false
                                  }
                                  numeric
                                >
                                  <Tooltip
                                    title="Sort"
                                    placement="bottom-start"
                                    enterDelay={300}
                                  >
                                    <TableSortLabel
                                      active={orderBy === "sharedIdentitySize"}
                                      direction={order}
                                      onClick={() =>
                                        this.handleSortRequest(
                                          "sharedIdentitySize"
                                        )
                                      }
                                    >
                                      Shared Identities
                                    </TableSortLabel>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data.Party.map(n => {
                                return (
                                  <TableRow key={n.last_name}>
                                    <TableCell component="th" scope="row">
                                      <a href={n.bloomURL} target="_blank">
                                        {n.first_name + " " + n.last_name}
                                      </a>
                                    </TableCell>
                                    <TableCell numeric>
                                      {n.louvainCommunity}
                                    </TableCell>
                                    <TableCell numeric>
                                      {n.sharedIdentitySize}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Grid>
                      </Grid>
                    );
                  }}
                </Query>
              </div>
            );
          }}
        </Query>
      </Paper>
    );
  }
}

export default withStyles(styles)(CaseList);
