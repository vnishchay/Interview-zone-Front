const headers = ()=> {
      if(localStorage.getItem('token') !== undefined) {
           const headers = {
                 Authorization : 'Bearer ' + localStorage.getItem('token')
           }
           return {
               headers
           }
      }
      return undefined ; 
}

export default headers ; 