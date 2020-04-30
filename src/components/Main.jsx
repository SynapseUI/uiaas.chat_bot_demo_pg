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
import ToggleBanner from './Banner';

const bank = 'https://synapse-chatbot-edd-demo.s3-us-west-1.amazonaws.com/assets/EDD_new.gif';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
      isLoading: 'loading',
      id: '5e9e126a79e883007b21eec6',
      fp: '',
      publicKey: 'public_key_aOQFodJgKI94wDk5eUhbNP0nfVZSWEtAx3ylC7XT'
    };
    const receiveMessage = (e) => {
      // if (e.data.synapse_chatbot_message.type === 'exit') {
      //   this.newFunction();
      // }
    };
    window.addEventListener('message', receiveMessage, false);
  }


  componentDidMount = () => {
    localStorage.clear();
    // this.createNewUser();
    this.internetCheck();
    this.pushToIframe();
    // // this.getNodes();
  }

  componentWillUnmount = () => {
    console.log('ehtis');
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
    const { fp } = this.state;
    // const updatePublicKey = () => 'public_key_aOQFodJgKI94wDk5eUhbNP0nfVZSWEtAx3ylC7XT';
    // const updateOauthKey = () => 'oauth_snMDtxJzhaLR13BIEAFNSiqjdXkYZ0uvowpyrKC4';
    // const updateUserId = () => '5cdca3d814ddee0064a05b17';
    const updateUserId = () => '5ea0e14574b817007f8765b1';
    const updatePublicKey = async () => {
      const publicKey = await this.getPublicKey();
      return publicKey;
    };
    const updateFingerprint = () => fp;
    window.SynapseMain({ updatePublicKey, updateFingerprint, updateUserId });
  }

  updateUserInfo = (userId) => {
    const { publicKey, fp, id } = this.state;
    return getUserInfo(id, publicKey, fp)
      .then((response) => {
        // console.log(response, "look here", response.data.refresh_token)
        this.setState({ id: response.data._id }, () => { this.pushToIframe(response.data.refresh_token); });
        // const key = response.data.public_key_obj.public_key;
        // this.setState({ publicKey: key });
        // return key;
      });
  }

  getPublicKey = () => {
    const { props } = this;
    const { id, publicKey } = this.state;
    return generatePublicKey(id)
      .then((res) => {
        const key = res.data.public_key_obj.public_key;
        this.setState({ publicKey: key });
        setTimeout(() => {
          this.setState({ load: false, isLoading: null });
        }, 2000);
        return key;
      });
  }


  generateOuth = (refreshToken) => {
    const { props } = this;
    const { id, publicKey } = this.state;
    return generateOauthKey(id, refreshToken, publicKey)
      .then((responseSecond) => {
        localStorage.setItem('userId', responseSecond.data.user_id);
        localStorage.setItem('synapseOauth', responseSecond.data.oauth_key);
        props.updateUserInfo('oauth_key', responseSecond.data.oauth_key);
        this.setState({ load: false, isLoading: null });
        return responseSecond.data.oauth_key;
      })
      .catch((err) => {
        switch (err.response.data.http_code) {
          case '500':
            props.updateBanner({
              isOpen: true,
              content: 'The server is down, please try again later.'
            });
            break;
          case '429':
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.'
            });
            break;
          case '503':
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.'
            });
            break;
          case '504':
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.'
            });
            break;
          default:
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.'
            });
        }
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
              <div className="welcome">Welcome to the EDD Chatbot demo.</div>
              <Button id="link-button-iframe" className={`iframe-btn ${isLoading}`} type="button">Upload Documents</Button>
              <AccountList load={load} />
            </div>
            <div className="main-right-child" style={{ float: 'right' }}>
              <div><img className="bank-gif" src={bank} alt="gif" /></div>
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
