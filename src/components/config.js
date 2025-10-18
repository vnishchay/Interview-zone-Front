// Base API URL can be configured via REACT_APP_API_URL in environment
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const headers = ()=> {
      const token = localStorage.getItem('token');
      if(token !== undefined && token !== null) {
           const headers = {
                 Authorization : 'Bearer ' + token
           }
           return {
               headers
           }
      }
      return undefined ; 
}

export default headers ; 