import axios from 'axios';
import store from '../store/store';

const URL_USER = '/api/v3.1/users';
// const oauthKey = 'oauth_snMDtxJzhaLR13BIEAFNSiqjdXkYZ0uvowpyrKC4';
// const userId = '5cdca3d814ddee0064a05b17';
const oauthKey = localStorage.getItem('synapseOauth');
const userId = localStorage.getItem('userId');
const publicKey = 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F';
const ipAddress = '172.69.22.117';

// localStorage.setItem('userId', '5b5f95dcf122e319740dbc76');
// localStorage.setItem('synapseOauth', 'oauth_y4NKwCgfj2QF1svkoV5pqHuU7Im8OXaxZTAtd0hL');
// localStorage.setItem('ipAddress', '172.69.22.117');
// localStorage.setItem('publicKey', 'public_key_n7YOZjuGemJ9cPWBKQLNMH2h0iaU1X0v5CrdgAIx');

export function fetchNodes(type, id, oauth) {
  let URL_NODE = `${URL_USER}/${id}/nodes`;
  if (type) {
    URL_NODE += `?type=${type}`;
  }
  return axios.get(URL_NODE, {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-USER': `${oauth}|`,
      'X-SP-USER-IP': '172.69.22.117'
    }
  });
}

export function createTestUser() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F',
      'X-SP-USER': '|badc522c6a325711f51841fc6f1e8bd0',
      'X-SP-USER-IP': `${ipAddress}`
    }
  };
  const payload = {
    logins: [
      {
        email: 'testchatbot@synapsefi.com'
      }
    ],
    phone_numbers: [
      '901.111.1111'
    ],
    legal_names: [
      'Test Chatbot'
    ],
    ips: [
      '127.0.0.1'
    ],
    extra: {
      is_business: false,
      cip_tag: 1
    }
  };
  return axios.post(URL_USER, payload, config);
}


export function generateOauthKey(id, refreshToken, newpublicKey) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // 'X-SP-GATEWAY': 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F',
      'X-SP-GATEWAY': `${newpublicKey}`,
      'X-SP-USER': '|badc522c6a325711f51841fc6f1e8bd0',
      'X-SP-USER-IP': `${ipAddress}`
    }
  };
  const payload = {
    refresh_token: `${refreshToken}`,
    scope: [
      'USER|PATCH',
      'USER|GET',
      'CONVERSATION|GET',
      'CONVERSATION|POST',
      'CONVERSATION|PATCH',
      'CONVERSATIONS|GET',
      'CONVERSATIONS|POST',
      'MESSAGES|POST',
      'MESSAGES|GET'
    ]
  };
  return axios.post(`https://uat-uiaas-v2.synapsefi.com/api/v3.1/oauth/${id}`, payload, config);
}


export function generatePublicKey() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': 'client_id_sqkFx4C8Hz0Snaib3eT6oPDUu0K7ytXjAd2pNJWG|client_secret_irJqTlDU8NVnEtjMbxmO6uRzYp1f0KCIF70wdS52'
    }
  };
  return axios.get('api/v3.1/client?issue_public_key=YES&scope=OAUTH|POST,USERS|POST,USERS|GET,USER|GET,USER|PATCH,SUBSCRIPTIONS|GET,SUBSCRIPTIONS|POST,SUBSCRIPTION|GET,SUBSCRIPTION|PATCH,CLIENT|REPORTS,CLIENT|CONTROLS', config);
}

export function getUserInfo(id, publicKeyNew, fp) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': publicKeyNew,
      'X-SP-USER': `|${fp}`
    }
  };
  return axios.get(`api/v3.1/users/${id}`, config);
}
