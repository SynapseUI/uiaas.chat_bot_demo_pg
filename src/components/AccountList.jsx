import React, { Component } from 'react';
import features from '../constants/featureCons';

class AccountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const ele = () => (
      <div className="feature-ele">
        <ul>
          {
            Object.values(features).map(feature => (
              <li className="feature-list">
                { feature }
              </li>
            ))
          }
        </ul>
      </div>

    );
    return (
      <div className="account-list-container">
        <div className="title">Features</div>
        {ele()}
      </div>
    );
  }
}

export default (AccountList);
