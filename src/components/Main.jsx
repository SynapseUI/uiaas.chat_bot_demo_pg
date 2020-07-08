import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import { updateNewNodes, updateUserInfo, updateBanner } from '../actions/bankLoginActions';
import { createTestUser, generateOauthKey, generatePublicKey, getUserInfo } from '../services/nodeService';
import { userAction, agentAction } from '../constants/actionsList';
import displayErrorBanner from '../services/displayErrorBanner';
import ToggleBanner from './Banner';

const agentDemoGif = 'https://synapse-banking-qa.s3-us-west-1.amazonaws.com/Agent_Demo.gif';
const userDemoGif = 'https://synapse-banking-qa.s3-us-west-1.amazonaws.com/End_user_demo.gif';
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
      isLoading: 'loading',
      id: '5e3c756e3c4e28008d53f68e',
      fp: 'badc522c6a325711f51841fc6f1e8bd0',
      publicKey: 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4'
    };
    const receiveMessage = (e) => {
    };
    window.addEventListener('message', receiveMessage, false);
  }


  componentDidMount = () => {
    const { id, oauthKey } = this.state;
    localStorage.clear();
    this.createNewUser();
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


  pushToIframe = (refreshTocken) => {
    const { id, refreshToken, fp, publicKey } = this.state;
    // const updatePublicKey = async () => {
    //   const publicKey = await this.getPublicKey();
    //   return publicKey;
    // };
    const updatePublicKey = () => publicKey;
    const updateUserId = () => id;
    const updateFingerprint = () => fp;

    window.SynapseMain({ updatePublicKey, updateFingerprint, updateUserId });
  }

  updateUserInfo = (userId) => {
    const { publicKey, fp, id } = this.state;
    return getUserInfo(id, publicKey, fp)
      .then((response) => {
        this.setState({ id: response.data._id, refreshToken: response.data.refresh_token }, () => { this.pushToIframe(response.data.refresh_token); });
      });
  }

  createNewUser = (type) => {
    const { props } = this;
    createTestUser()
      .then((response) => {
        if (type === 'id') {
          return response.data._id;
        }
        this.setState({ load: false, isLoading: null });
        props.updateUserInfo('id', response.data._id);
        props.updateUserInfo('refreshToken', response.data.refresh_token);
        this.setState({ id: response.data._id, refreshToken: response.data.refresh_token }, () => this.updateUserInfo());
      })
      .catch((err) => {
        displayErrorBanner(err.response.data);
      });
  }

  getPublicKey = () => {
    const { props } = this;
    const { id, publicKey } = this.state;
    return generatePublicKey(id)
      .then((response) => {
        const key = response.data.public_key_obj.public_key;
        this.setState({ publicKey: key });
        return key;
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
            <div className="welcome">Welcome to the Servicing Demo.</div>
            <div className="gifContainer">
              <div className="main-left-child" id="link-button-iframe">
                <div>
                  <img className="user-gif" src={userDemoGif} alt="gif" />
                </div>
                <div>
                  <h1 className="userAgentHeader">End User</h1>
                  <ul className="actionsList">
                    {userAction.map((action, idx) => <li className="action">{action}</li>)
                    }
                  </ul>
                </div>
              </div>
              <div
                className="main-right-child"
                style={{ float: 'right' }}
                onClick={() => window.open('https://uat-silent-wildflower-5960.synapsefi.com/v2/chatbot#/', '_newtab')}
                onKeyPress={() => window.open('https://uat-silent-wildflower-5960.synapsefi.com/v2/chatbot#/', '_newtab')}
              >
                <div><img className="agent-gif" src={agentDemoGif} alt="gif" /></div>
                <div>
                  <h1 className="userAgentHeader">Agent</h1>
                  <ul className="actionsList">
                    {agentAction.map((action, idx) => <li className="action">{action}</li>)
                    }
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    nodeLinked: state.bankLoginReducer.nodeLinked,
    id: state.bankLoginReducer.id,
    refreshToken: state.bankLoginReducer.refreshToken,
    oauth_key: state.bankLoginReducer.oauth_key,
    banner: state.bankLoginReducer.banner
  };
}

export default connect(mapStateToProps, { updateNewNodes, updateUserInfo, updateBanner })(Main);
