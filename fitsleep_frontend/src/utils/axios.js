import axios from 'axios'
import isUndefined from 'lodash/isUndefined'
import AxiosHelper from './AxiosHelper'
let request

export default async function (config, otherConfig = {}) {
  if (isUndefined(request)) {
    // Create AxiosHelper instance
    const axiosHelper = new AxiosHelper()
    // Create Axios instance and configure it
    request = axios.create(axiosHelper.config())
  }
  request.interceptors.request.use((config) => {
    return config
  })
  // Listen response
  request.interceptors.response.use(null, error => {
    return Promise.reject(error)
  })
}
