import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Linked from '../svg/Linked';
import fetchNodes from '../services/nodeService';
import updateNewNodes from '../actions/bankLoginActions';
import utils from '../services/utils';
import Circle from '../svg/Circle';
import { VisaSVG, MastercardSVG, DiscoverSVG, AmericanExpSVG, DefaultCardSVG } from '../svg/CardLogos';

let show = true;
const logo = 'https://synapse-chatbot-demo.s3.amazonaws.com/assets/bank-icon.png';

function addDefaultSrc(ev) {
  ev.target.src = logo;
  show = false;
  ev.target.style.display = 'block';
  ev.target.style.width = '33.3px';
  ev.target.style.marginRight = '12px';
}
class CardsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // nodes: [],
      loading: true,
      // count: 0
    };
  }

  componentDidMount = () => {
    const { nodeLinked } = this.props;
    this.setState({ loading: false });
  }

  selectCardLogo = (network) => {
    switch (network) {
      case ('VISA'):
        return <VisaSVG />;
      case ('DISCOVER'):
        return <DiscoverSVG />;
      case ('AMERICAN'):
        return <AmericanExpSVG />;
      case ('MASTERCARD'):
        return <MastercardSVG />;
      default:
        return <DefaultCardSVG />;
    }
  }

  render() {
    const { loading } = this.state;
    const { nodeLinked } = this.props;
    const nodes = (nodeLinked).slice(0, 3);
    return (
      <div className="account-list-container">
        <div className="title">Linked cards</div>
        {loading
          ? <div className="loading">Loading cards...</div>
          : (
            <div>
              <div className="list" style={{ borderLeft: 'solid 6px #000000' }}>
                {nodes.length === 0
                  ? (
                    <div>
                      <div className="list-item" style={{ borderBottom: '1px solid rgb(134, 134, 134)', paddingbottom: '18px' }}>
                        <Circle />
                        <div className="list-right">
                          <span className="list-info" id="list-info">No linked cards</span>
                          <div className="list-content" id="list-content"><Linked /><span className="list-date">Click on Link/Unlink Cards </span></div>
                        </div>
                      </div>
                    </div>
                  )
                  : (
                    <div>
                      {nodes.map((node, idx) => {
                        // const name = item.bank_name;
                        const listText = utils.capitalizeOnlyFirstChar(`${node.info.nickname} - ${node.info.network}`);
                        let border = '';
                        const padding = '';
                        if (idx !== 0) {
                          border = 'solid 1px #868686';
                          // padding = '18px';
                        }

                        return (
                          <div className="list-item" key={node.bank_name} style={{ borderTop: border, paddingTop: padding }}>
                            <div className="list-left list-logo">
                              {/* <img className="list-logo" src={this.selectCardLogo(node.info.network)} alt="logo" /> */}
                              {this.selectCardLogo(node.info.network)}
                            </div>
                            <div className="list-right">
                              <div className="list-info">{listText} </div>
                              <div className="list-content"><Linked /><span className="list-date">Linked {moment(node.timeline[0].date).format('MM/DD/YYYY')}</span></div>
                            </div>
                          </div>
                        );
                      })
                      }
                    </div>
                  )}
              </div>
            </div>
          )}

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    nodeLinked: state.bankLoginReducer.newNodes.nodeLinked,
  };
}

export default connect(mapStateToProps, { updateNewNodes })(CardsList);
