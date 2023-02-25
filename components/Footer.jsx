import styles from "@/styles/Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}></div>
      <p className={styles.rights}>Now that you scrolled all way down, please keep in mind that all rights reserved  for <a href="https://hicham-zaadla.vercel.app/" target="_blank" style={{
        borderBottom: '1px solid #181818'
      }}>Zaadla</a></p>
    </footer>
  )
}