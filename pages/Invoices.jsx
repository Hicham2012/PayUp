import React from 'react'
import invoice from '@/styles/Invoice.module.css'
import {useState} from 'react'
import * as fcl from '@onflow/fcl'
import '@/flow/config'
import { useRouter } from 'next/router'
import { Document, Page, Text, View, StyleSheet, Image, Font, PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer'



export default function Invoice(user) {
  const ref = React.useRef()
  const [wave, setWave] = useState()
  const [invobj, setInvobj] = useState({
    receiver: {
      name: '',
      email: '',
      address: '0xac7e951a234080e3'
    },
    describtion: '',
    hourlyWage: '',
    workedHours: '',
    total: ''
  })
  // console.log(invobj.workedHours.length)
  const [isMinted, setIsMinted] = useState(false)
  const [isvalid, setIsvalid] = useState()
  const [ids, setIDs] = useState([])
  const [len, setLen] = useState()
  const [latestInvo, setLatestInvo] = useState()
  const [reaveal, setReveal] = useState(false)
  const [transactionn, setTransaction] = useState({
    status: '',
    event: '',
  })
  const checkForm = () => {
    if(
      invobj.receiver.name != 'Choose client' &&
      invobj.describtion.length > 0 &&
      invobj.hourlyWage.length > 0 &&
      invobj.workedHours.length > 0 &&
      invobj.total.length > 0 
    ) {
      setIsvalid(true)
      setWave('')
    } else {
      setIsvalid(false)
    }
  }
  const getLatest = () => {
   
      const latest = Math.max(...ids)
      setLatestInvo(latest)
    
    }
    // console.log(len)
    console.log(latestInvo)
  // console.log(Math.max(...ids))
  // getLatest()
  

   // Mint invoices NFT
   const createInvoices = async () => {
    const transactionId = await fcl.mutate({
      cadence: 
      `
      import PayUpNFT from 0xPay-Up

      transaction (
          jobDescribtion: String,
          hourlyWage: Int,
          workedHours: Int,
          total: Int,
          sender: Address,
          receiver: Address
      ) {
          let receiverRef: &{PayUpNFT.PayUpNFTCollectionPublic}
          prepare(signer: AuthAccount){
              self.receiverRef = signer.getCapability<&{PayUpNFT.PayUpNFTCollectionPublic}>(PayUpNFT.CollectionPublicPath)
                                      .borrow()
                                      ?? panic("Could not borrow a reference")
          }

          execute {
              let newNFT <- PayUpNFT.mintNFT(
                  jobDescribtion: jobDescribtion,
                  hourlyWage: hourlyWage,
                  workedHours: workedHours,
                  total: total,
                  sender: sender,
                  receiver: receiver
              )

              self.receiverRef.deposit(token: <- newNFT)

              log("Invoice minted")
          }
      }
      `,
      args: (arg, t) => [
        arg(`${invobj.describtion}`, t.String),
        arg(`${invobj.hourlyWage}`, t.Int),
        arg(`${invobj.workedHours}`, t.Int),
        arg(`${invobj.total}`, t.Int),
        arg(`${data.address}`, t.Address),
        arg(`${invobj.receiver.address}`, t.Address)
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorisations: [fcl.authz],
      limit: 50
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    if (transaction.status === 4) {
      
      setIsMinted(true)
      

    }
  }

  // Check ID
  const checkID = async() => {
    const id = await fcl.query({
      cadence:`
      import NonFungibleToken from 0xNonFungibleToken
      import PayUpNFT from 0xPay-Up

      /// Script to get NFT IDs in an account's collection
      ///
      pub fun main(address: Address): [UInt64] {
          let account = getAccount(address)
          let collectionPublicPath = /public/payupNFTCollection

          let collectionRef = account
              .getCapability(collectionPublicPath)
              .borrow<&{NonFungibleToken.CollectionPublic}>()
              ?? panic("Could not borrow capability from public collection at specified path")

          return collectionRef.getIDs()
      }
      `,
      args: (arg, t) => [
        arg(`${data.address}`, t.Address)
      ]
    })
    setIDs(id)
    setLen(id.length)
    setLatestInvo(Math.max(...id))
  }
  console.log(latestInvo)
 

  // Send Invoice
  const sendInvoice = async() => {
    const send = await fcl.mutate({
      cadence:`
      import NonFungibleToken from 0xNonFungibleToken
      import PayUpNFT from 0xPay-Up
      
      /// This transaction is for transferring and NFT from
      /// one account to another
      
      transaction(recipient: Address, withdrawID: UInt64) {
      
          /// Reference to the withdrawer's collection
          let withdrawRef: &PayUpNFT.Collection
      
          /// Reference of the collection to deposit the NFT to
          let depositRef: &{NonFungibleToken.CollectionPublic}
      
          prepare(signer: AuthAccount) {
              // borrow a reference to the signer's NFT collection
              self.withdrawRef = signer
                  .borrow<&PayUpNFT.Collection>(from: PayUpNFT.CollectionStoragePath)
                  ?? panic("Account does not store an object at the specified path")
      
              // get the recipients public account object
              let recipient = getAccount(recipient)
      
              // borrow a public reference to the receivers collection
              self.depositRef = recipient
                  .getCapability(PayUpNFT.CollectionPublicPath)
                  .borrow<&{NonFungibleToken.CollectionPublic}>()
                  ?? panic("Could not borrow a reference to the receiver's collection")
      
          }
      
          execute {
      
              // withdraw the NFT from the owner's collection
              let nft <- self.withdrawRef.withdraw(withdrawID: withdrawID)
      
              // Deposit the NFT in the recipient's collection
              self.depositRef.deposit(token: <-nft)
          }
      
          post {
              !self.withdrawRef.getIDs().contains(withdrawID): "Original owner should not have the NFT anymore"
              self.depositRef.getIDs().contains(withdrawID): "The reciever should now own the NFT"
          }
      }
      `,
      args: (arg, t) => [
        arg(`${invobj.receiver.address}`, t.Address),
        arg(`${latestInvo}`, t.UInt64)
      ]
    })


    const transaction = await fcl.tx(send).onceSealed()
    console.log(transaction)
    if(transaction.status === 4) {
      setTransaction(prevTransaction => {
        return {
          ...prevTransaction,
          status: 4,
          event: transaction.events
        }
      })
      setIsMinted(false)
    }
    
    
    setIsMinted(false)
  }
  console.log(transactionn)
   function handleChange() {
    setTransaction(prevTransaction => {
      return {
        ...prevTransaction,
        status: '',
      }
    })
    setReveal(true)
   }
  const MintInvo = async() => {
    const show = await handleChange()
    const mint = await createInvoices()
    const check = await checkID()
  }
  // Popup
  const Popup = () => (
    <div className={invoice.popup} style={{
      transform: !reaveal ? 'translateY(-200%)' : 'translateY(0%)',
      transition: 'all 700ms ease'
    }}>
      <div onClick={() => setReveal(false)} className={invoice.close}>✖</div>
      {transactionn.status === 4  ? <div className={invoice.popinfo}>
      <p>Invoice sent succesfully</p>
      <div>sealed</div>
      </div> :
      <div className={invoice.popinfo}>
      <p className={invoice.pending}>Pending</p>
      </div>}
      <div className={invoice.bar}>
      <div className={invoice.progress} style={{
        background: transactionn.status === 4 ? '#212121' : 'transparent',
        transition: 'all 700ms ease'
      }}>
        <div className={invoice.dots} style={{
          animation: isMinted ? 'dots 1s ease' : 'nop 1s ease',
          // transition: 'width 1s ease',
          width: isMinted && transactionn.status === 4 ? '17%' : isMinted && transactionn.status === '' ? '14%' : '0%'
        }}></div>
        <div className={invoice.dots} style={{
          animation: isMinted ? 'dots 1s ease' : 'nop 1s ease',
          // transition: 'width 1s ease',
          width: isMinted && transactionn.status === 4 ? '17%' : isMinted && transactionn.status === '' ? '14%' : '0%'
        }}></div>
        <div className={invoice.dots} style={{
          animation: isMinted ? 'dots 1s ease' : 'nop 1s ease',
          // transition: 'width 1s ease',
          width: isMinted && transactionn.status === 4 ? '17%' : isMinted && transactionn.status === '' ? '14%' : '0%'
        }}></div>
        <div className={invoice.dots} style={{
          animation: isMinted ? 'dots 1s ease' : 'nop 1s ease',
          // transition: 'width 1s ease',
          width: isMinted && transactionn.status === 4 ? '17%' : isMinted && transactionn.status === '' ? '14%' : '0%'
        }}></div>
        <div className={invoice.dots} style={{
          animation: isMinted ? 'dots 1s ease' : 'nop 1s ease',
          // transition: 'width 1s ease',
          width: isMinted && transactionn.status === 4 ? '17%' : isMinted && transactionn.status === '' ? '14%' : '0%'
        }}></div>
      </div>
      </div>
      <div className={invoice.linko}>
      {transactionn.status === 4 ? <a className={invoice.link} href={`https://testnet.flowscan.org/transaction/${transactionn.event[0].transactionId}`} target="_blank">View transaction</a> : <a></a>}
      </div>
    </div>
  )
  ////////


  const router = useRouter();
const data = router.query;
console.log(data.address)
var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear()
// console.log(datetime)
// InvoicePDF
const Quixote = () => (
  <Document style={styles.doc}>
    <Page style={styles.body}>
      <View style={styles.view1}>
      <Text style={styles.title}>INVOICE</Text>
      </View>
      <View style={styles.view2}>
      <Text style={styles.author}>{data.name}</Text>
      <Text style={styles.info}>{data.email}</Text>
      </View>
      <View style={styles.view3}>
      <Text style={styles.author2}>Client</Text>
      <Text style={styles.receiver}>{invobj.receiver.name}</Text>
      <Text style={styles.info2}>{invobj.receiver.email.replace(' ', '')}</Text>
      </View>
      <View style={styles.view4}>
        <Text style={styles.info}>Ivoice sent date: {datetime}</Text>
        <Text style={styles.info}>Currency: US Dollars</Text>
      </View>

      {/* Table */}
      <View style={styles.row1}>
        <Text style={styles.info3}>Service description</Text>
        <Text style={styles.info3}>Hourly wage</Text>
        <Text style={styles.info3}>Worked hours</Text>
        <Text style={styles.info3}>Total</Text>
      </View>
      <View style={styles.row2}>
        <View style={styles.row21}>
          <Text style={styles.info5}>{invobj.describtion}</Text>
        </View>
        <View style={styles.row21}>
          <Text style={styles.info4}>{invobj.hourlyWage}</Text>
        </View>
        <View style={styles.row21}>
          <Text style={styles.info4}>{invobj.workedHours}</Text>
        </View>
        <View style={styles.row22}>
          <Text style={styles.info4}>${invobj.total}</Text>
        </View>
      </View>
      <View style={styles.row2}>
        <View style={styles.row21}>
          <Text style={styles.info5}></Text>
        </View>
        <View style={styles.row21}>
          <Text style={styles.info4}></Text>
        </View>
        <View style={styles.row21}>
          <Text style={styles.info4}></Text>
        </View>
        <View style={styles.row22}>
          <Text style={styles.info4}></Text>
        </View>
      </View>
      <View>
        <Text style={styles.footer}>Invoice template made by PayUp</Text>
      </View>
    </Page>
  </Document>
);

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2'
});

const styles = StyleSheet.create({
  doc: {
    width: '100vh'
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#FFDDCE'
  },
  view1: {
    // backgroundColor: 'purple'
    paddingBottom: 30
  },
  title: {
    fontSize: 32,
    // textAlign: 'left',
    // fontFamily: 'Inter',
    // fontWeight: 700,
    fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: 700,
  fontDisplay: 'swap',
  src: 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZJhiI2B.woff2)',
  unicodeRange:" U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F"
    
  },
  author: {
    fontSize: 27,
    textAlign: 'left',
    fontWeight: 500
  },
  author2: {
    fontSize: 27,
    textAlign: 'right',
    fontWeight: 500
  },
  info: {
    fontSize: 14,
    fontWeight: 400,
    color: '#1D1D1D'
  },
  info2: {
    fontSize: 14,
    fontWeight: 400,
    color: '#1D1D1D',
    textAlign: 'right'
  },
  receiver: {
    fontFamily: 'Inter',
    textAlign: 'right',
    fontWeight: 600,
    fontSize: 14,
    // paddingBottom: 10
  },

  // Table
  row1: {
    // backgroundColor: 'red',
    paddingTop: 25,
    paddingBottom: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottom: '1px solid #1D1D1D'
  },
  info3: {
    fontSize: 14,
    fontWeight: 400,
    color: '#1D1D1D',
    width: '25%',
    textAlign: 'center'
  },
  row2: {
    // backgroundColor: 'red',
    // paddingTop: 25,
    // paddingTop: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  info4: {
    fontSize: 11,
    fontWeight: 400,
    color: '#1D1D1D',
    // width: '25%',
    textAlign: 'center',
    // paddingTop: 7
  },
  row21: {
    width: '25%',
    display: 'flex',
    // backgroundColor: 'red',
    borderRight: '1px solid #1D1D1D',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  row22: {
    width: '25%',
    display: 'flex',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  info5: {
    fontSize: 11,
    fontWeight: 400,
    color: '#1D1D1D',
    // width: '25%',
    textAlign: 'left',
    paddingTop: 7
  },
  //
  footer: {
    // fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 300,
    position: 'absolute',
    top: 485,
    left: 382,
    // marginTop: 450,
    textAlign: 'right',
    
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});
//////////
console.log(invobj.receiver.email.replace(' ', ''))
  return (
    <main>
      <div className={invoice.container}>
      <Popup />
        <div className={invoice.cont}>
        <form action="" className={invoice.form}>
          <label htmlFor="">Send invoice to:</label>
          
          <select id="cars" name="cars" onChange={(e) => setInvobj(prevInv => {
              return {
                ...prevInv,
                receiver:{
                  name: e.target.value,
                  address: '0xac7e951a234080e3',
                  email: `${e.target.value}gmail.com`

                }
              }
            })} required>
            <option>Choose client</option>
            <option value='Hicham Fake'>Hicham Fake</option>
            <option value='Ansu Fake'>Ansu Fake</option>
            <option value='Eliot Fake'>Eliot Fake</option>
          </select> <br />
          <label htmlFor="">Work describtion:</label> <br />
          {/* <input type="text" /> <br /> */}
          <textarea
           name="" 
           id="" 
           cols="50" 
           rows="10" 
           placeholder="Service describtion - from: (starting date) to: (ending date)."
           onChange={(e) => setInvobj(prevInv => {
            return {
              ...prevInv,
              describtion: e.target.value
            }
          })}
          required
          ></textarea> <br />
          <label htmlFor="">Hourly wage in USD:</label>
          <input
           type="number" 
           min="1" 

           onChange={(e) => setInvobj(prevInv => {
            return {
              ...prevInv,
              hourlyWage: e.target.value
            }
          })} 
          required
          /> <br />
          <label htmlFor="">Worked hours:</label>
          <input
           type="number"
           min="1"
           onChange={(e) => setInvobj(prevInv => {
            return {
              ...prevInv,
              workedHours: e.target.value
            }
          })}
          required 
          /> <br />
          <label htmlFor="">Total payment:</label>
          <input
           type="number"
           min="1"
           onChange={(e) => setInvobj(prevInv => {
            return {
              ...prevInv,
              total: e.target.value
            }
          })} 
          required
          /> <br /> <br />
        </form>
        <div className={invoice.but}>
        <div suppressHydrationWarning={true}>
          {process.browser && <PDFDownloadLink className={invoice.but1} document={<Quixote />} fileName="invoice.pdf">
              {({ blob, url, loading, error }) => (loading ? 'Download PDF' : 'Download PDF')}
          </PDFDownloadLink>}
        </div>
          
         {!isMinted ? <button onMouseEnter={checkForm} onClick={isvalid ? MintInvo : null} style={{
            cursor: isvalid ? 'pointer' : 'not-allowed',
          }}>Mint Invoice</button> :
          <button onMouseEnter={checkForm} onClick={sendInvoice} style={{
            cursor: isvalid ? 'pointer' : 'not-allowed',
          }}>Send Invoice</button>} 
        </div>
        </div>
      </div>
      {/* <PDFViewer>
    <Quixote />
  </PDFViewer> */}
    </main>
  )
}
