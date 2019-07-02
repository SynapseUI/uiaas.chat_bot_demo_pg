import React, { Component, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import Header from './Header';
import AccountList from './AccountList';
import Logo from '../svg/Logo';
import { updateNewNodes, updateUserInfo, updateBanner } from '../actions/bankLoginActions';
import { createTestUser, generateOauthKey, generatePublicKey, fetchNodes } from '../services/nodeService';
import ToggleBanner from './Banner';

const bank = 'https://synapse-chatbot-demo.s3.amazonaws.com/assets/bank.gif';
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
      isLoading: 'loading'
    };
    const receiveMessage = (e) => {
      console.log(props);
      if (e.data.message === 'close') {
        this.newFunction();
      }
    };
    window.addEventListener('message', receiveMessage, false);
  }


  componentDidMount = () => {
    localStorage.clear();
    this.createNewUser();
    this.internetCheck();
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


  pushToIframe = () => {
    const { id, refreshToken } = this.state;
    const updatePublicKey = () => 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F';
    // const updateOauthKey = () => 'oauth_snMDtxJzhaLR13BIEAFNSiqjdXkYZ0uvowpyrKC4';
    // const updateUserId = () => '5cdca3d814ddee0064a05b17';
    const updateUserId = () => id;
    const updateOauthKey = async () => {
      const oauth = await this.generateOuth();
      return oauth;
    };
    window.SynapseMain({ updatePublicKey, updateOauthKey, updateUserId });
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
    // this.setState({ id: '5d116600f12ce3006db1fc26', refreshToken: 'refresh_hWAXl0wsvJmBbe0QVN3E6yLKG7uD9UOIM4cZHxog' }, () => this.pushToIframe());
    // props.updateUserInfo('id', '5d116600f12ce3006db1fc26');
    // props.updateUserInfo('refreshToken', 'refresh_hWAXl0wsvJmBbe0QVN3E6yLKG7uD9UOIM4cZHxog');
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

  newFunction = () => {
    const { props } = this;
    this.getNodes(props.id, props.oauth_key);
  }

  getNodes = (id, oauth) => {
    const { props } = this;
    fetchNodes('ACH-US', id, oauth)
      .then((response) => {
        // sets all nodes in redux
        props.updateNewNodes(response.data.nodes);
      })
      .catch((err) => {
        switch (err.response.data.http_code) {
          case '500':
            props.updateBanner({
              isOpen: true,
              content: 'The server is down, please try again later.',
            });
            break;
          case '429':
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.',
            });
            break;
          case '503':
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.',
            });
            break;
          case '504':
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.',
            });
            break;
          default:
            props.updateBanner({
              isOpen: true,
              content: 'The server is busy, please try again later.',
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
              <div className="welcome">Welcome to the Bank Logins demo.</div>
              <Button id="link-button-iframe" className={`iframe-btn ${isLoading}`} type="button">Link an account </Button>
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
