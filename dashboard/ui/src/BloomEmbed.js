import React from "react";

import { withStyles } from "@material-ui/core/styles";

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

class BloomEmbed extends React.Component {
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

    return (
      
        <iframe id="inlineFrameExample"
    title="Inline Frame Example"
    width="100%"
    height="100%"
    src={this.props.bloomURL}>
</iframe>

    );
  }
}

export default withStyles(styles)(BloomEmbed);
