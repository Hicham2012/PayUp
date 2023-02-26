import React from 'react'
import styles from '@/styles/Header.module.css'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import * as fcl from '@onflow/fcl'
import '@/flow/config'


export default function Header(props) {
  const [ishovered, setIsHovered] = useState('')
  const [isLocation, setIsLocation] = useState('')
  const [border, setBorder] = useState('')
  const [user, setUser] = useState({loggedIn: null})
  const [isClicked, setIsClicked] = useState(false)
  const [profile, setProfile] = useState(false)
  
  const [allinfo, setAllInfo] = useState({
    email: '',
    name: ''
  })
  const profileAll = {
    address: user.addr,
    email: allinfo.email,
    name: allinfo.name
  }
  // console.log(profileAll)
  
  useEffect(() => fcl.currentUser.subscribe(setUser), [])
  console.log()
  
  useEffect(() => {
    return () => {
    const pathname = window.location.pathname
    if (pathname === '/') {
      setBorder('home')
    }
  }
    

  }, [isLocation])
      // Setup collection to save invoices
      const initAccount = async () => {
        const transactionId = await fcl.mutate({
          cadence: `
          import NonFungibleToken from 0xNonFungibleToken
          import PayUpNFT from 0xPay-Up
          import MetadataViews from 0xView
  
          /// This transaction is what an account would run
          /// to set itself up to receive NFTs
  
          transaction {
              prepare(signer: AuthAccount) {
                  
                  // Return early if the account already has a collection
                  if signer.borrow<&PayUpNFT.Collection>(from: PayUpNFT.CollectionStoragePath) != nil {
                      return
                  }
                  
                  
  
                  // Create a new empty collection
                  let collection <- PayUpNFT.createEmptyCollection()
  
                  // save it to the account
                  signer.save(<-collection, to: PayUpNFT.CollectionStoragePath)
                  
                  // Check if it's already linked and unlink it if so
                if signer.getLinkTarget(PayUpNFT.CollectionPublicPath) != nil { 
                      signer.unlink(PayUpNFT.CollectionPublicPath)
                }
                  // create a public capability for the collection
                  signer.link<&{NonFungibleToken.CollectionPublic, PayUpNFT.PayUpNFTCollectionPublic, MetadataViews.ResolverCollection}>(
                      PayUpNFT.CollectionPublicPath,
                      target: PayUpNFT.CollectionStoragePath
                  )
      }
  }
          `,
          payer: fcl.authz,
          proposer: fcl.authz,
          authorizations: [fcl.authz],
          limit: 50
        })
      
        const transaction = await fcl.tx(transactionId).onceSealed()
        console.log(transaction)
      }
    
      const run = async() => {
        const start = await fcl.logIn()
        const end = await initAccount()

      }
      const leave = async() => {
        const logout = await fcl.unauthenticate()
        const closeTab = await setIsClicked(false)
      }
  
  return (
    <nav
      className={styles.nav}
      style={{
      width: props.clientheight > props.plus  ? '70px' : '70%' , 
      borderRadius: props.clientheight > props.plus ? '50%'  : '0 0 10px 10px'
      }}
    >
      <ul className={styles.ul} style={{
        display: props.clientheight > props.plus ? 'none' : 'flex',
        opacity: props.clientheight > props.plus ? '0' : '1',
        transition: 'all 100ms'
      }}>
        <li className={styles.li} 
          onMouseEnter={() => setIsHovered('home')}
          onMouseLeave={() => setIsHovered('')}
          onClick={() => setBorder('home')}
        >
          <Link href="/">
            <p style={{
          borderBottom: border === 'home' ? '1px solid #181818' : 'none',
          color: '#181818',
          opacity: ishovered === '' ? '1' : ishovered !== 'home' ? '.85' : '1'
        }}>
            Home
            </p>
          </Link>
          </li>
        <li className={styles.li} 
          onMouseEnter={() => setIsHovered('companies')}
          onMouseLeave={() => setIsHovered('')}
        >
          <p style={{
          // borderBottom: isLocation === 'companies' ? '1px solid #181818' : 'none',
          color: '#181818',
          opacity: ishovered === '' ? '1' : ishovered !== 'companies' ? '.85' : '1'
        }}>
          Companies
        </p>
          
          </li>
        <li className={styles.li}
          onMouseEnter={() => setIsHovered('invoices')}
          onMouseLeave={() => setIsHovered('')}
          onClick={() => setBorder('invo')}
        >
          { user.addr && allinfo.email.length > 0 && allinfo.name.length > 0 ?  <Link href={{
              pathname: '/Invoices',
              query: profileAll
              }}>
              <p style={{
            borderBottom: border === 'invo' ? '1px solid #181818' : 'none',
            color: '#181818',
            opacity: ishovered === '' ? '1' : ishovered !== 'invoices' ? '.85' : '1'
          }}>
            Invoice
          </p>
              
            </Link> : 
            <p style={{
              // borderBottom: isLocation === '/Invoices' ? '1px solid #181818' : 'none',
              color: '#181818',
              opacity: ishovered === '' ? '1' : ishovered !== 'invoices' ? '.85' : '1'
            }} onClick={() => {alert('Please connect wallet and fill Profil info first!')}} >Invoice</p>
            }
          </li>
        <li className={styles.li}
          onMouseEnter={() => setIsHovered('connect')}
          onMouseLeave={() => setIsHovered('')}
          
        >
          {user.loggedIn === null ? <p onClick={run} style={{
          color: '#181818',
          opacity: ishovered === '' ? '1' : ishovered !== 'connect' ? '.85' : '1'
        }}>
          Connect wallet
        </p> : 
        <div>
          <div className={styles.wallet} onClick={() => setIsClicked(prevClicked => !prevClicked)}>
           
            <p style={{
          color: '#181818',
          opacity: ishovered === '' ? '1' : ishovered !== 'connect' ? '.85' : '1',
          marginTop: '2%'
        }}>
              {user.addr}
            </p>
            <div style={{
              transform: isClicked ? 'rotate(180deg)' : 'rotate(0deg)'
            }}></div>
          </div>
          <div className={styles.options} style={{
            display: isClicked ? 'grid' : 'none'
          }}>
            <span onClick={() => setProfile(true)}>Profile</span>
            <span onClick={leave}>Disconnect</span>
          </div>
          </div>
        }
          </li>
      </ul>
      <div className={styles.profile} style={{
        display: profile ? 'flex' : 'none'
      }}>

        <h1>Enter profile info</h1>
        <div>
        <div onClick={() => setProfile(false)} className={styles.close}>✖</div>
        <div>
          <label htmlFor="">Email:</label>
          <input type="text" required onChange={(e) => { setAllInfo(
            prevInfo => {
              return {
                ...prevInfo,
                email: e.target.value
              }
            }
          )}}/>
        </div>
        <div>
          <label htmlFor="">Full name:</label>
          <input type="text" required onChange={(e) => { setAllInfo(
            prevInfo => {
              return {
                ...prevInfo,
                name: e.target.value
              }
            }
          )}}/>
        </div>
        <input type="submit" value="save" onClick={() => setProfile(false)}/>
        </div>
      </div>
    </nav>
  )
}
