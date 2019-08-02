import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./UserList.css";
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
  TextField
} from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300
  }
});

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "last_name",
      page: 0,
      rowsPerPage: 10,
      usernameFilter: ""
    };
  }

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
          User List
        </Typography>
        <TextField
          id="search"
          label="User Name Contains"
          className={classes.textField}
          value={this.state.usernameFilter}
          onChange={this.handleFilterChange("usernameFilter")}
          margin="normal"
          variant="outlined"
          type="text"
          InputProps={{
            className: classes.input
          }}
        />

        <Query
          query={gql`
            query usersPaginateQuery(
              $first: Int
              $offset: Int
              $orderBy: [_PartyOrdering]
              $filter: _PartyFilter
            ) {
              Party(
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
            filter: this.getFilter()
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            return (
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key="last_name"
                      sortDirection={orderBy === "last_name" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "last_name"}
                          direction={order}
                          onClick={() => this.handleSortRequest("last_name")}
                        >
                          Last Name
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="louvainCommunity"
                      sortDirection={
                        orderBy === "louvainCommunity" ? order : false
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
                            this.handleSortRequest("louvainCommunity")
                          }
                        >
                          Louvain Community
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="sharedIdentitySize"
                      sortDirection={
                        orderBy === "sharedIdentitySize" ? order : false
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
                            this.handleSortRequest("sharedIdentitySize")
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
                            {n.first_name +' ' + n.last_name}
                          </a>
                        </TableCell>
                        <TableCell numeric>{n.louvainCommunity}</TableCell>
                        <TableCell numeric>{n.sharedIdentitySize}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            );
          }}
        </Query>
      </Paper>
    );
  }
}

export default withStyles(styles)(UserList);
