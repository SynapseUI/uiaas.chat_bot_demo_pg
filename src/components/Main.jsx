import React, { Component, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import Header from './Header';
import CardsList from './CardsList';
import Logo from '../svg/Logo';
import { updateNewNodes, updateUserInfo, updateBanner } from '../actions/bankLoginActions';
import { createTestUser, generateOauthKey, generatePublicKey, fetchNodes, addBaseDoc, getUserInfo } from '../services/nodeService';
import ToggleBanner from './Banner';
import displayErrorBanner from '../services/errorHandling';

const cardAnimation = 'https://synapse-chatbot-interchange-demo.s3-us-west-1.amazonaws.com/assets/interchange_animation.gif';
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      isLoading: null,
      // id: '5ef93c213ab1440077873ecb',
      // refreshToken: 'refresh_CldvsJt8BIFYQ5R2kVc6awP4guDjx3mA10qyWUTi',
      // oauthKey: 'oauth_xgujUqMkTA0t0dePwlm1pJGZhIBaX4SRzsV5CiHr',
      id: '5ef944384c8d060056661f10',
    };
    const receiveMessage = (e) => {
      if (e.data.synapse_chatbot_message.type === 'exit') {
        this.newFunction();
      }
    };
    window.addEventListener('message', receiveMessage, false);
  }


  componentDidMount = () => {
    const { id, oauthKey } = this.state;
    localStorage.clear();
    // this.createNewUser();
    this.internetCheck();
    // this.userInfo();
    // this.pushToIframe();
    // addBaseDoc(id, oauthKey);
    // this.getNodes();
    // this.generateOuth();
    this.getNodes(id, oauthKey);
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
    // const updateOauthKey = () => 'oauth_snMDtxJzhaLR13BIEAFNSiqjdXkYZ0uvowpyrKC4';
    // const updateUserId = () => '5cdca3d814ddee0064a05b17';
    const getFp = () => 'badc522c6a325711f51841fc6f1e8bd0';
    // this.generateOuth();
    // const updateUserId = () => '5ef93c213ab1440077873ecb';

    const updateUserId = () => id;
    // const updateOauthKey = async () => {
    //   const oauth = await this.generateOuth();
    //   return oauth;
    // };
    window.SynapseMain({ updatePublicKey, getFp, updateUserId });
  }

  createNewUser = (type) => {
    const { props } = this;
    createTestUser()
      .then((response) => {
        // this.generateOauthKey();
        if (type === 'id') {
          return response.data._id;
        }
        props.updateUserInfo('id', response.data._id);
        props.updateUserInfo('refreshToken', response.data.refresh_token);
        this.setState({ id: response.data._id, refreshToken: response.data.refresh_token }, () => this.pushToIframe());
      })
      .catch((err) => {
        displayErrorBanner(err.response.data);
      });
  }

  userInfo = () => {
    const { props } = this;
    const { id } = this.state;
    getUserInfo(id)
      .then((response) => {
        props.updateUserInfo('id', response.data._id);
        props.updateUserInfo('refreshToken', response.data.refresh_token);
        this.setState({ id: response.data._id, refreshToken: response.data.refresh_token }, () => { this.pushToIframe(); this.generateOuth(); });
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
        this.getNodes(responseSecond.data.user_id, responseSecond.data.oauth_key);
        return responseSecond.data.oauth_key;
      })
      .catch((err) => {
        displayErrorBanner(err.response.data);
      });
  }

  newFunction = () => {
    const { props } = this;
    this.getNodes(props.id, props.oauth_key);
  }

  getNodes = (id, oauth) => {
    const { props } = this;
    fetchNodes('INTERCHANGE-US', id, oauth)
      .then((response) => {
        // sets all nodes in redux
        props.updateNewNodes(response.data.nodes);
      })
      .catch((err) => {
        displayErrorBanner(err.response.data);
        // switch (err.response.data.http_code) {
        //   case '500':
        //     props.updateBanner({
        //       isOpen: true,
        //       content: 'The server is down, please try again later.',
        //     });
        //     break;
        //   case '429':
        //     props.updateBanner({
        //       isOpen: true,
        //       content: 'The server is busy, please try again later.',
        //     });
        //     break;
        //   case '503':
        //     props.updateBanner({
        //       isOpen: true,
        //       content: 'The server is busy, please try again later.',
        //     });
        //     break;
        //   case '504':
        //     props.updateBanner({
        //       isOpen: true,
        //       content: 'The server is busy, please try again later.',
        //     });
        //     break;
        //   default:
        //     props.updateBanner({
        //       isOpen: true,
        //       content: 'The server is busy, please try again later.',
        //     });
        // }
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
              <div className="welcome">Welcome to the Interchnage demo.</div>
              <Button id="link-button-iframe" className={`iframe-btn ${isLoading}`} type="button">Link/Unlink Cards </Button>
              <CardsList load={load} />
            </div>
            <div className="main-right-child" style={{ float: 'right' }}>
              <div><img className="bank-gif" src={cardAnimation} alt="gif" /></div>
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
