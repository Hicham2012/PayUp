
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from 'react'


export default function Home(props) {
  return (
    <main className={styles.home}>
      {/* Logo */}
      <section className={styles.logo}>
        <span className={styles.logo1}>PayUp</span>
        <span className={styles.logo2}>for god’s sake</span>
      </section>

      {/* Hero */}
      <section className={styles.cadre} style={{
        position: props.clientheight >= 6.3 && props.clientheight < 35 ? 'fixed' : 'absolute',
        top: props.clientheight >= 6.3 && props.clientheight < 35  ? '5%' : props.clientheight >= 35 ? '255%' : '50%',
        dislpay: props.clientheight >= 46 ? 'none' : '',
        overflow: 'hidden',
      }}>
        {/* No worrying */}
        <div className={styles.first} style={{
          opacity: props.clientheight >= 6.3 ? `calc(8 - ${props.clientheight})` : '1',
          letterSpacing: props.clientheight >= 6.3 ? `${props.clientheight}px` : 'none',
          display: props.clientheight >= 46 ? 'none' : 'flex',
          gap: props.clientheight >= 6.3 ? `${props.clientheight * 2}%` : '2%' ,
          transition: 'all 500ms ease'
        }}>
          <div style={{
            transform: props.clientheight >= 6.3 && props.clientheight<= 36.3? `translateY(-${props.clientheight * 5.5}%) skew(${props.clientheight * 3.5}deg) translateX(-${props.clientheight}%)` : props.clientheight >= 36.3? `translateY(-${props.clientheight * 10.5}%) skew(${props.clientheight * 3.5}deg) translateX(-${props.clientheight}%) ` : 'none',
            transition: 'all 500ms ease'
          }}>No</div>
          <div style={{
            transform: props.clientheight >= 6.3 && props.clientheight<= 36.3? `translateY(-${props.clientheight * 5.5}%) skew(-${props.clientheight * 3.5}deg) translateX(${props.clientheight * 3}%)` : props.clientheight >= 36.3? `translateY(-${props.clientheight * 10.5}%) skew(-${props.clientheight * 3.5}deg) translateX(${props.clientheight / 2}%) ` : 'none',
            transition: 'all 500ms ease'
          }}>worrying</div>
        </div>
        {/* No stress */}
        <div className={styles.second} style={{
          opacity: props.clientheight >= 18.3 ? `calc(8 - ${props.clientheight})` : '1',
          letterSpacing: props.clientheight >= 18.3 ? `${props.clientheight}px` : 'none',
          display: props.clientheight >= 46 ? 'none' : 'flex',
          gap: props.clientheight >= 18.3 ? `${props.clientheight}%` : '2%' ,
          transform: props.clientheight >= 10.3 ? 'translateY(-130%)' : 'none',
          transition: 'all 500ms ease'
        }}>
          <div style={{
            transform: props.clientheight >= 18.3 && props.clientheight<= 38.3 ? `translateY(-${props.clientheight}%) skew(${props.clientheight * 3.5}deg) translateX(-${props.clientheight}%)` : props.clientheight >= 38.3 ? `translateY(-${props.clientheight}%) skew(${props.clientheight * 3.5}deg) translateX(-${props.clientheight}%) ` : 'none',
            transition: 'all 500ms ease'
          }}>No</div>
          <div style={{
            transform: props.clientheight >= 18.3 && props.clientheight<= 38.3 ? `translateY(-${props.clientheight}%) skew(-${props.clientheight * 3.5}deg) translateX(${props.clientheight * 3}%)` : props.clientheight >= 38.3 ? `translateY(-${props.clientheight}%) skew(-${props.clientheight * 3.5}deg) translateX(${props.clientheight / 2}%) ` : 'none',
            transition: 'all 500ms ease'
          }}>stress</div>
        </div>
        {/* Just $$ */}
        <div className={styles.third} style={{
          opacity: props.clientheight >= 26.3 ? `calc(8 - ${props.clientheight})` : '1',
          letterSpacing: props.clientheight >= 26.3 ? `${props.clientheight}px` : 'none',
          display: props.clientheight >= 46 ? 'none' : 'flex',
          gap: props.clientheight >= 26.3 ? `${props.clientheight}%` : '2%' ,
          transform: props.clientheight >= 10.3 && props.clientheight < 20.3 ? 'translateY(-130%)' : props.clientheight >= 20.3 ? 'translateY(-260%)' : 'none',
          transition: 'all 500ms ease'
        }}>
          <div style={{
            transform: props.clientheight >= 26.3 && props.clientheight<= 38.3 ? `translateY(-${props.clientheight}%) skew(${props.clientheight * 3.5}deg) translateX(-${props.clientheight}%)` : props.clientheight >= 38.3 ? `translateY(-${props.clientheight}%) skew(${props.clientheight * 3.5}deg) translateX(-${props.clientheight}%) ` : 'none',
            transition: 'all 500ms ease'
          }}>Just</div>
          <div style={{
            transform: props.clientheight >= 26.3 && props.clientheight<= 38.3 ? `translateY(-${props.clientheight}%) skew(-${props.clientheight * 3.5}deg) translateX(${props.clientheight * 3}%)` : props.clientheight >= 38.3 ? `translateY(-${props.clientheight}%) skew(-${props.clientheight * 3.5}deg) translateX(${props.clientheight / 2}%) ` : 'none',
            transition: 'all 500ms ease'
          }}>$$</div>
        </div>
        {/* Yes */}
        <div className={styles.forth} style={{
          opacity: props.clientheight >= 29.3 ? `calc(8 - ${props.clientheight})` : '1',
          letterSpacing: props.clientheight >= 29.3 ? `${props.clientheight}px` : 'none',
          display: props.clientheight >= 46 ? 'none' : 'flex',
          gap: props.clientheight >= 29.3 ? `${props.clientheight}%` : '2%' ,
          transform: props.clientheight >= 10.3 && props.clientheight < 20.3 ? 'translateY(-130%)' : props.clientheight >= 20.3 && props.clientheight < 30.3 ? 'translateY(-260%)' : props.clientheight >= 30.3 ? `translateY(-390%) ` : 'none',
          transition: 'all 500ms ease'
        }}>
          Yes
        </div>
        {/* $$$ */}
        <div className={styles.fifth} style={{
          opacity: '1',
          letterSpacing: props.clientheight >= 26.3 ? `${props.clientheight}px` : 'none',
          display: props.clientheight >= 46 ? 'none' : 'flex',
          gap: 'none',
          transform: props.clientheight >= 10.3 && props.clientheight < 20.3 ? 'translateY(-130%)' : props.clientheight >= 20.3 ? 'translateY(-260%)' : 'none',
          transition: 'all 500ms ease'
        }}>
          $$$
        </div>
      </section>
      {/* Info */}
      <section id="info" className={styles.info}>
        {/* info-1 */}
        <div id="info-1" className={styles.info1}>
        <div className ={styles.pic1}></div>
        <div className={styles.det1}>
          <div className={styles.writing}>
          <p>Boundles</p>
          <p>Check people you will be working with in advance.</p>
          </div>
          <div className={styles.arrow}></div>
        </div>
        </div>
        {/* info-2 */}
        <div id="info-2" className={styles.info2}>
        <div className={styles.det2}>
          <div className={styles.writing}>
            <p>Decisive</p>
            <p>You can check in advance the<br /> campany’s payment behavior to <br /> help you decide if working with <br /> them will be safe or not.</p>
          </div>
          <div className={styles.arrow}></div>
        </div>
        <div className ={styles.pic2}></div>
        </div>
        {/* info-3 */}
        <div id="info-3" className={styles.info3}>
        <div className ={styles.pic3}></div>
        <div className={styles.det3}>
          <div className={styles.writing}>
            <p>Transparent</p>
            <p>Easily send invoices to your client <br /> throught the blockchain.</p>
          </div>
          <div className={styles.arrow}></div>
        </div>
        </div>
      </section>
      {/* Quote */}

      {/* FAQ */}
      <section className={styles.cont}>
        <h1>FAQ</h1>
      <div className={styles.faq}>
        <details>
          <summary>What is PayUp for?</summary>
          <div className={styles.answers}>This is a plateform where you can manage your invoices and view companies data.</div>
        </details>
        <details>
          <summary>Why would I use this plateform?</summary>
          <div className={styles.answers}>PayUp will provide you with a confortable environment where you can send invoices and receive your well deserved payment.</div>
        </details>
        <details>
          <summary>what is "for god's sake" for</summary>
          <div className={styles.answers}>It was added to express the anxiety that a person feels when they don't receive their payment in the agreed time and had to put effort to ask for their payment.</div>
        </details>
        <details>
          <summary>Will PayUp be adapted by other companies?</summary>
          <div className={styles.answers}>Yes, the plan is to make the company's condition more visible to potential employees, so they can have a better choice on whiche company they wanna apply to.</div>
        </details>
      </div>
      </section>
      {/* Flex */}
      <section className={styles.flex} style={{
        display: props.clientheight >= 70 ? 'flex' : 'none',
      }}>
        <div></div>
        <div>
        <div className={styles.flow} style={{
          transform: `rotate(${props.clientheight * 10}deg)`,
          transition: '50ms linear',
        }}></div>
        <div className={styles.flow2}></div>
        </div>
        </section>
    </main>
  )
}
