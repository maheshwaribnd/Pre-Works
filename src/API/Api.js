import axios from 'axios';

export const BASE_URL = 'https://preworks.basenincorp.com/api/';

const constructApiRequest = (path, method, body) => ({
  url: path,
  method: method,
  data: body,
  headers: {
    'Content-Type': 'application/json',
  },
});

const constructApiRequest1 = (path, method, body) => ({
  url: path,
  method: method,
  data: body,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const Axios = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

const requests = {
  get: path => Axios(constructApiRequest(path, 'get')),
  post: (path, params) => Axios(constructApiRequest(path, 'post', params)),
  put: (path, params) => Axios(constructApiRequest(path, 'put', params)),
  delete: path => Axios(constructApiRequest(path, 'delete')),
};

const requests1 = {
  get: path => Axios(constructApiRequest1(path, 'get')),
  post: (path, params) => Axios(constructApiRequest1(path, 'post', params)),
  put: (path, params) => Axios(constructApiRequest1(path, 'put', params)),
  update: path => Axios(constructApiRequest1(path, 'update')),

  delete: path => Axios(constructApiRequest1(path, 'delete')),
};

// add request path here
const requestPath = {
  //Post request
  userLogin: 'auth/login',
  customerRegistration: 'auth/CustomerRegister',
  contractorRegistration: 'auth/ContractorRegister',
  architectureRegistration: 'auth/ArchitectureRegister',
  forgetPassword: 'auth/forgot-password',
  otpVerify: 'auth/OtpVerified',

  //customer
  createPrework: 'auth/createPrework',

  //Get request

  //customer
  customerProfile: 'auth/customerProfile',
  ListOfPrework: 'auth/listOpenPreworks',
  openPreworkById: 'auth/openPrework',
  closedPrework: 'auth/listClosePreworks',
  closedPreworkById: 'auth/ClosePrework',
  architectList: 'auth/ArchitectureList',
  architectListById: 'auth/getArchitectureById',

  // Contractor
  contractoreProfile: 'auth/contractorProfile',

  // Architect
  architectProfile: 'auth/architectureProfile',

  // Update request

  customerUpdate: 'auth/customeredit/update',
};

const ApiManager = {
  //Post API
  userLogin: params => {
    return requests.post(`${requestPath.userLogin}`, params);
  },

  forgetPassword: params => {
    return requests.post(requestPath.forgetPassword, params);
  },

  otpVerify: params => {
    return requests.post(requestPath.otpVerify, params);
  },

  customerRegistration: params => {
    return requests1.post(requestPath.customerRegistration, params);
  },

  contractorRegistration: params => {
    return requests1.post(requestPath.contractorRegistration, params);
  },

  architectureRegistration: params => {
    return requests1.post(requestPath.architectureRegistration, params);
  },

  createPreWork: params => {
    return requests1.post(requestPath.createPrework, params);
  },

  // Get API
  customerProfile: userId => {
    return requests.get(`${requestPath.customerProfile}/${userId}`);
  },

  ListOfPrework: userId => {
    return requests.get(`${requestPath.ListOfPrework}/${userId}`);
  },

  OpenPreworkById: preworkId => {
    return requests.get(`${requestPath.openPreworkById}/${preworkId}`);
  },

  ClosedPrework: () => {
    return requests.get(requestPath.closedPrework);
  },

  ClosedPreworkById: preworkId => {
    return requests.get(`${requestPath.closedPreworkById}/${preworkId}`);
  },

  ArchitectList: () => {
    return requests.get(requestPath.architectList);
  },

  ArchitectById: architectId => {
    return requests.get(`${requestPath.architectListById}/${architectId}`);
  },

  ContractorProfile: ContractorId => {
    return requests.get(`${requestPath.contractoreProfile}/${ContractorId}`);
  },

  ArchitectProfile: ArchitectId => {
    return requests.get(`${requestPath.architectProfile}/${ArchitectId}`);
  },

  // Update API

  CustomerUpdate: (userId, formData) => {
    return requests1.put(`${requestPath.customerUpdate}/${userId}`, formData);
  },

  // Delete API

  // notification: userId => {
  //   return requests.get(`${requestPath.customerNotification}/${userId}`);
  // },

  // updateNotification: userId => {
  //   return requests.get(`${requestPath.updateNotification}/${userId}`);
  // },
};

export default ApiManager;
