import React from "react";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({});

class BloomEmbed extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <iframe
        id="inlineFrameExample"
        title="Inline Frame Example"
        width="100%"
        height="100%"
        src={this.props.bloomURL}
      />
    );
  }
}

export default withStyles(styles)(BloomEmbed);
