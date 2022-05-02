import React from 'react'
// import router from 'umi/router';

class CatchError extends React.Component {
  componentDidCatch(error, info) {
    // if(process.env.API !== 'dev') {
    //   router.push('/user/login')
    // }
  }

  render() {
    return this.props.children
  }
}

export default CatchError
