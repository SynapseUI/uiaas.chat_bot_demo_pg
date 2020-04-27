import axios from 'axios';
import store from '../store/store';
import { generateName } from '../constants/userRandomNames';

const URL_USER = '/api/v3.1/users';
const oauthKey = localStorage.getItem('synapseOauth');
const userId = localStorage.getItem('userId');
const publicKey = 'public_key_qWCwNJcVPT2jMY105s7K6bUDm3gixoXkf94ZrR8F';
const ipAddress = '172.69.22.117';
const clientId = 'client_id_sqkFx4C8Hz0Snaib3eT6oPDUu0K7ytXjAd2pNJWG';
const clientSecret = 'client_secret_irJqTlDU8NVnEtjMbxmO6uRzYp1f0KCIF70wdS52';
const fingerPrint = 'badc522c6a325711f51841fc6f1e8bd0';


export function createTestUser() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': `${publicKey}`,
      'X-SP-USER': `|${fingerPrint}`,
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
      '202-555-0137', '415-526-8943'
    ],
    legal_names: [
      generateName()
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

export function generatePublicKey(id) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': `${clientId}|${clientSecret}`,
    }
  };
  return axios.get(`api/v3.1/client?issue_public_key=YES&scope=OAUTH|POST,USERS|POST,USERS|GET,USER|GET,USER|PATCH,SUBSCRIPTIONS|GET,SUBSCRIPTIONS|POST,SUBSCRIPTION|GET,SUBSCRIPTION|PATCH,CLIENT|REPORTS,CLIENT|CONTROLS&user_id=${id}`, config);
}

export function getUserInfo(id, publicKeyNew, fp) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': publicKeyNew,
      'X-SP-USER': `|${fp}`
    }
  };
  return axios.get(`${URL_USER}/${id}?full_dehydrate=no`, config);
}
