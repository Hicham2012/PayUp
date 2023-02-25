import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import React from 'react'
import {useEffect, useState} from 'react'

export default function App({ Component, pageProps }) {
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

    return(
        <>
            <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
                <Header
      clientheight={clientheight} 
      plus={plus}
    />
                <Component {...pageProps } />
            </main>
            <Footer />

        </>
    ) 
    
}