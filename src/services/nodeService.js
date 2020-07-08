import axios from 'axios';
import store from '../store/store';
import { generateName } from '../constants/userRandomNames';

const URL_USER = '/api/v3.1/users';
const oauthKey = localStorage.getItem('synapseOauth');
const userId = localStorage.getItem('userId');
const publicKey = 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4';
const ipAddress = '172.69.22.117';


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

export function getUserInfo(id) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4',
      'X-SP-USER': '|badc522c6a325711f51841fc6f1e8bd0',
      'X-SP-USER-IP': `${ipAddress}`
    }
  };
  return axios.get(`api/v3.1/users/${id}`, config);
}

export function createTestUser() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4',
      'X-SP-USER': '|badc522c6a325711f51841fc6f1e8bd0',
      'X-SP-USER-IP': `${ipAddress}`
    }
  };
  const payload = {
    logins: [
      {
        email: 'test@synapsefi.com'
      }
    ],
    phone_numbers: [
      '415.235.6723'
    ],
    legal_names: [
      generateName()
    ],
    documents: [
      {
        email: 'test@synapsefi.com',
        phone_number: '415.235.6723',
        ip: '127.0.0.1',
        name: generateName(),
        alias: '',
        entity_type: 'NOT_KNOWN',
        entity_scope: 'Not Known',
        day: 5,
        month: 1,
        year: 1989,
        address_street: '1 Market St',
        address_city: 'San Francisco',
        address_subdivision: 'CA',
        address_postal_code: '94105',
        address_country_code: 'US',
        virtual_docs: [
          {
            document_value: '2222',
            document_type: 'SSN'
          }
        ],
        physical_docs: [
          {
            document_value: 'data:image/gif;base64,SUQs==',
            document_type: 'GOVT_ID'
          }
        ],
        social_docs: [],
        docs_key: 'PARENT_DOCS'
      },
      {
        email: 'test1@synapsefi.com',
        phone_number: '415.235.6723',
        ip: '127.0.0.1',
        name: generateName(),
        alias: '',
        entity_type: 'NOT_KNOWN',
        entity_scope: 'Not Known',
        day: 7,
        month: 2,
        year: 1984,
        address_street: '1 Market St',
        address_city: 'San Francisco',
        address_subdivision: 'CA',
        address_postal_code: '94105',
        address_country_code: 'US',
        social_docs: [],
        physical_docs: [],
        virtual_docs: [],
        doc_option_key: 'NO_SUB_DOCS',
        docs_key: 'CHILD_DOCS',
        docs_title: 'Child',
      }
    ],
    extra: {
      supp_id: 'test_user_id',
      cip_tag: 1,
      is_business: false
    }
  };
  return axios.post(URL_USER, payload, config);
}

export function addBaseDoc(id, oauth) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4',
      'X-SP-USER': `${oauth}|`,
      'X-SP-USER-IP': `${ipAddress}`
    }
  };
  const payload = {
    documents: [
      {
        email: 'test@synapsefi.com',
        phone_number: '415.235.6723',
        ip: '127.0.0.1',
        name: 'Kristina Acevedo',
        alias: '',
        entity_type: 'NOT_KNOWN',
        entity_scope: 'Not Known',
        day: 7,
        month: 2,
        year: 1984,
        address_street: '1 Market St',
        address_city: 'San Francisco',
        address_subdivision: 'CA',
        address_postal_code: '94105',
        address_country_code: 'US',
        virtual_docs: [
          {
            document_value: '2222',
            document_type: 'SSN'
          }
        ],
        physical_docs: [
          {
            document_value: 'data:image/gif;base64,SUQs==',
            document_type: 'GOVT_ID'
          }
        ],
        social_docs: [],
        docs_key: 'PERSONAL_DOCS'
      }
    ]
  };
  return axios.patch(`api/v3.1/users/${id}`, payload, config);
}

export function generateOauthKey(id, refreshToken) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4',
      'X-SP-USER': '|badc522c6a325711f51841fc6f1e8bd0',
      'X-SP-USER-IP': `${ipAddress}`
    }
  };
  const payload = {
    refresh_token: `${refreshToken}`
  };
  return axios.post(`api/v3.1/oauth/${id}`, payload, config);
}


export function generatePublicKey(id, refreshToken) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-SP-GATEWAY': 'public_key_ba9geYIouUvhLOlqiK03QmwpZ20fEJVWDXM76GT4'
    }
  };
  return axios.post('api/v3.1/client/controls', config);
}
