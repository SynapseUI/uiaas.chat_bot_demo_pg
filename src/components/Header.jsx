import React, { PureComponent } from 'react';

import Logo from '../svg/Logo';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Header">
        <div className="left-child">
          <a className="home" href="https://synapsefi.com/"><Logo /></a>
        </div>
        <div className="right-child">
          <a className="link-1" href="https://docs.synapsefi.com/">API Docs</a>
          <a className="link-2" href="https://blog.synapsefi.com">Blog</a>
        </div>
      </div>
    );
  }
}

export default Header;
