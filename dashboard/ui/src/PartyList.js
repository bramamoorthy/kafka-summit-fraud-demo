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
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";

const styles = theme => ({
  root: {
    //maxWidth: 700,
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
      ? { last_name_contains: this.state.usernameFilter, case_id_not: "" }
      : { case_id_not: "" };
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
          Party List
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
                id
                louvainCommunity
                occupation
                sharedIdentitySize
                bloomURL
                caseBloomURL
                fraud_confirmed
                fraud_followup
                case_id
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
                          Name
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      key="occupation"
                      sortDirection={orderBy === "occupation" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "occupation"}
                          direction={order}
                          onClick={() => this.handleSortRequest("occupation")}
                        >
                          Occupation
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      key="case_id"
                      sortDirection={orderBy === "case_id" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "case_id"}
                          direction={order}
                          onClick={() => this.handleSortRequest("case_id")}
                        >
                          Case ID
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell>Adjudicate Case</TableCell>
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
                      <TableRow key={n.id}>
                        <TableCell component="th" scope="row">
                          <a href={n.bloomURL} target="_blank">
                            {n.first_name + " " + n.last_name}
                          </a>
                        </TableCell>
                        <TableCell>{n.occupation}</TableCell>
                        <TableCell>
                          <a href={n.caseBloomURL} target="_blank">
                            {n.case_id}
                          </a>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Button
                              aria-controls="simple-menu"
                              aria-haspopup="true"
                              onClick={this.handleClick}
                              className={classes.menuButton}
                            >
                              Adjudicate
                            </Button>
                            <Menu
                              id="simple-menu"
                              anchorEl={this.state.anchorEl}
                              keepMounted
                              open={Boolean(this.state.anchorEl)}
                              onClose={this.handleClose}
                            >
                              <MenuItem onClick={this.handleClose}>
                                Fraud
                              </MenuItem>
                              <MenuItem onClick={this.handleClose}>
                                Not Fraud
                              </MenuItem>
                            </Menu>
                          </div>
                        </TableCell>
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
