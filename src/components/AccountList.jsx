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
      <div className="list" style={{ borderLeft: '6px solid rgb(0, 0, 0)' }}>
        <div>
          {
            Object.values(features).map((feature, idx) => (
              <div className="list-info" style={idx === 0 ? { paddingBottom: '13px' } : { borderTop: '1px solid #B3B3B3', paddingTop: '14px' }}>
                { feature }
              </div>
            ))
          }
        </div>
      </div>

    );
    return (
      <div className="account-list-container">
        <div className="title">Features</div>
        <div> {ele()} </div>
      </div>
    );
  }
}

export default (AccountList);
