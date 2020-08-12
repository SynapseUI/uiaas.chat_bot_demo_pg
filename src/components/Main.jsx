import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import Header from './Header';
import { updateNewNodes, updateUserInfo, updateBanner } from '../actions/bankLoginActions';
import { generateOauthKey, getUserInfo } from '../services/nodeService';
import ToggleBanner from './Banner';
import userAction from '../constants/actionsList';
import displayErrorBanner from '../services/errorHandling';

const cardAnimation = 'https://synapse-chatbot-cards-demo.s3-us-west-1.amazonaws.com/assets/Card_Manager_Animation.gif';
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      isLoading: null,
      id: '5e692c033c4e28008cee2f07'
    };
  }


  componentDidMount = () => {
    const { id, oauthKey } = this.state;
    localStorage.clear();
    this.pushToIframe();
    this.internetCheck();
  }

  internetCheck = () => {
    // event listener online to detect network disconnection
    const { props } = this;
    window.addEventListener('offline', (e) => {
      props.updateBanner({
        isOpen: true,
        content: 'You’re offline.',
        bannerLink: {
          text: 'Reconnect'
        }
      });
    }, true);
    // event listener online to detect network recovery
    window.addEventListener('online', (e) => {
      props.updateBanner({
        isOpen: false
      });
    }, true);
  }


  pushToIframe = () => {
    const { id, refreshToken } = this.state;
    const updatePublicKey = () => 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4';
    const getFp = () => 'badc522c6a325711f51841fc6f1e8bd0';

    const updateUserId = () => '5e692c033c4e28008cee2f07';
    window.SynapseMain({ updatePublicKey, getFp, updateUserId });
  }

  userInfo = () => {
    const { props } = this;
    const { id } = this.state;
    getUserInfo(id)
      .then((response) => {
        props.updateUserInfo('id', response.data._id);
        this.setState({ load: false, isLoading: null });

        props.updateUserInfo('refreshToken', response.data.refresh_token);
        this.setState({ id: response.data._id, refreshToken: response.data.refresh_token }, () => { this.pushToIframe(); });
      })
      .catch((err) => {
        displayErrorBanner(err.response.data);
      });
  }

  generateOuth = () => {
    const { props } = this;
    const { id, refreshToken } = this.state;
    return generateOauthKey(id, refreshToken)
      .then((responseSecond) => {
        localStorage.setItem('userId', responseSecond.data.user_id);
        localStorage.setItem('synapseOauth', responseSecond.data.oauth_key);
        props.updateUserInfo('oauth_key', responseSecond.data.oauth_key);
        this.setState({ load: false, isLoading: null });
        return responseSecond.data.oauth_key;
      })
      .catch((err) => {
        displayErrorBanner(err.response.data);
      });
  }


  render() {
    const { load, isLoading } = this.state;
    const { banner } = this.props;
    return (
      <Fragment>
        <ToggleBanner isOpen={banner.isOpen} type="error" content={banner.content} bannerLink={banner.bannerLink} />
        <div className="main-container">
          <Header />
          <div className="content-container">
            <div className="main-left-child">
              <div className="welcome">Welcome to the Card Management demo.</div>
              <div>
                <ul className="actionsList">
                  {userAction.map((action, idx) => <li className="action">{action}</li>)
                  }
                </ul>
              </div>
              <Button id="link-button-iframe" className={`iframe-btn ${isLoading}`} type="button">Get Started </Button>
            </div>
            <div className="main-right-child" style={{ float: 'right' }}>
              <img className="bank-gif" src={cardAnimation} alt="gif" />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    nodeLinked: state.reducer.nodeLinked,
    id: state.reducer.id,
    refreshToken: state.reducer.refreshToken,
    oauth_key: state.reducer.oauth_key,
    banner: state.reducer.banner
  };
}

export default connect(mapStateToProps, { updateNewNodes, updateUserInfo, updateBanner })(Main);
