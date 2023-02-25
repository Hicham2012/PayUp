import React from 'react'
import Home from './Home'
import {useState, useEffect} from 'react'

// import './scroll.css'

export default function Test() {
  const [clientheight, setClientWindowHeight] = useState()
  const [plus, setPlus] = useState()
  const handleScroll = () => {
    setClientWindowHeight(window.scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    setPlus(clientheight)
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [clientheight]);
  
//  console.log(clientheight)
  
  // if (clientheight > plus) {
  //   console.log('hide')
  // } else if (clientheight < plus) {
  //   console.log('show')
  // }
  return (
    <>
    {/* <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
    <Header
      clientheight={clientheight} 
      plus={plus}
    /> */}
    <Home 
      clientheight={clientheight}
    />
    {/* <Footer /> */}
    {/* </main> */}
    </>
  )
}