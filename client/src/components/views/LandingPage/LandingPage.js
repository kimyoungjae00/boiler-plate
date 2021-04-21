import React, { useEffect } from 'react';
import axios from 'axios'

const LandingPage = (props) => {

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
    .then((response) => {console.log(response)})
  }, [])
  
  return (
    <div>
      LandingPage
    </div>
  )
}

export default LandingPage;