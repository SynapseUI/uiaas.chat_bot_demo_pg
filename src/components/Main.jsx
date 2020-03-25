import React, { Component, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import Header from './Header';
import AccountList from './AccountList';
import Logo from '../svg/Logo';
import { updateNewNodes, updateUserInfo, updateBanner } from '../actions/bankLoginActions';
import { createTestUser, generateOauthKey, generatePublicKey, getUserInfo } from '../services/nodeService';
import { userAction, agentAction } from '../constants/actionsList';
import displayErrorBanner from '../services/displayErrorBanner';
import ToggleBanner from './Banner';

const bank = 'https://synapse-chatbot-demo.s3.amazonaws.com/assets/bank.gif';
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
      publicKey: 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F'
    };
    const receiveMessage = (e) => {
      // console.log(props);
    };
    window.addEventListener('message', receiveMessage, false);
  }


  componentDidMount = () => {
    localStorage.clear();
    // this.createNewUser();
    this.internetCheck();
    // this.getPublicKey();
    this.updateUserInfo();
    // this.pushToIframe();
    // // this.getNodes();
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
    const { id, refreshToken } = this.state;
    // var updatePublicKey = function () {
    //   return 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F';
    // }
    // var updateOauthKey = function () {
    //   return 'oauth_zoVHICyq7Xl8nBYmaxdMUTibsApJ50Rc0QGgWkN4';
    // }
    // var updateUserId = function () {
    //   return '5e692c033c4e28008cee2f07';
    // }
    const updatePublicKey = () => 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F';
    // const updateOauthKey = () => 'oauth_snMDtxJzhaLR13BIEAFNSiqjdXkYZ0uvowpyrKC4';
    const updateUserId = () => '5e3c756e3c4e28008d53f68e';
    // const updateUserId = () => '5cdca3d814ddee0064a05b17';
    // const updatePublicKey = async () => {
    //   const publicKey = await this.getPublicKey();
    //   // this.setState({ publicKey });
    //   return publicKey;
    // };
    // const updateUserId = () => id;
    const updateOauthKey = async () => {
      const oauth = await this.generateOuth(refreshTocken);
      return oauth;
    };
    window.SynapseMain({ updatePublicKey, updateOauthKey, updateUserId });
  }

  getPublicKey = () => generatePublicKey()
    .then((response) => {
      const key = response.data.public_key_obj.public_key;
      this.setState({ publicKey: key });
      return key;
    })

  updateUserInfo = (userId) => {
    const { publicKey, fp, id } = this.state;
    return getUserInfo(id, publicKey, fp)
      .then((response) => {
        // console.log(response, "look here", response.data.refresh_token)
        this.setState({ id: response.data._id, refreshToken: response.data.refresh_token }, () => { this.pushToIframe(response.data.refresh_token); });
        // const key = response.data.public_key_obj.public_key;
        // this.setState({ publicKey: key });
        // return key;
      });
  }

  // createNewUser = (type) => {
  //   const { props } = this;
  //   createTestUser()
  //     .then((response) => {
  //       // this.generateOauthKey();
  //       if (type === 'id') {
  //         return response.data._id;
  //       }
  //       props.updateUserInfo('id', response.data._id);
  //       props.updateUserInfo('refreshToken', response.data.refresh_token);
  //       this.setState({ id: response.data._id, refreshToken: response.data.refresh_token }, () => this.pushToIframe());
  //     })
  //     .catch((err) => {
  //       switch (err.response.data.http_code) {
  //         case '500':
  //           props.updateBanner({
  //             isOpen: true,
  //             content: 'The server is down, please try again later.'
  //           });
  //           break;
  //         case '429':
  //           props.updateBanner({
  //             isOpen: true,
  //             content: 'The server is busy, please try again later.'
  //           });
  //           break;
  //         case '503':
  //           props.updateBanner({
  //             isOpen: true,
  //             content: 'The server is busy, please try again later.'
  //           });
  //           break;
  //         case '504':
  //           props.updateBanner({
  //             isOpen: true,
  //             content: 'The server is busy, please try again later.'
  //           });
  //           break;
  //         default:
  //           props.updateBanner({
  //             isOpen: true,
  //             content: 'The server is busy, please try again later.'
  //           });
  //       }
  //     });
  //   // this.setState({ id: '5d116600f12ce3006db1fc26', refreshToken: 'refresh_hWAXl0wsvJmBbe0QVN3E6yLKG7uD9UOIM4cZHxog' }, () => this.pushToIframe());
  //   // props.updateUserInfo('id', '5d116600f12ce3006db1fc26');
  //   // props.updateUserInfo('refreshToken', 'refresh_hWAXl0wsvJmBbe0QVN3E6yLKG7uD9UOIM4cZHxog');
  // }

  generateOuth = (refreshToken) => {
    const { props } = this;
    const { id, publicKey } = this.state;
    // console.log("khjkhh", refreshToken)
    return generateOauthKey(id, refreshToken, publicKey)
      .then((responseSecond) => {
        // console.log("oauth_res", responseSecond)
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
            <div className="welcome">Welcome to the Servicing Demo.</div>
            <div className="gifContainer">
              <div className="main-left-child" id="link-button-iframe">
                <div>
                  <img className="user-gif" src={userDemoGif} alt="gif" />
                  {/* <Button id="link-button-iframe" className="iframe-btn" type="button">Click for demo </Button> */}
                </div>
                <div>
                  <h1 className="userAgentHeader">End User</h1>
                  <ul className="actionsList">
                    {userAction.map((action, idx) => <li className="action">{action}</li>)
                    }
                  </ul>
                </div>
              </div>
              <div className="main-right-child" style={{ float: 'right' }}>
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
