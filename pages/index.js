import styles from '../styles/Index.module.css'
import A1 from '../public/img/a1.jpg'
import Image from 'next/image'


export default function Home() {
  return (
    <div className={styles.index}>
      <section className={styles.indexLeft}>
        <div className={styles.leftCategories}>
          <ul>
            <li>Web Development</li>
            <li>Blockchain</li>
            <li>Gaming</li>
            <li>Finance</li>
            <li>Web Security</li>
          </ul>
        </div>
        <div className={styles.leftMain}>
          <ul>
            <li>
              <span className={styles.leftMainImg}>
                {/* 166x194 */}
                <Image src={A1} alt='a1' placeholder='blur'></Image>
              </span>
              <span className={styles.leftMainCon}>
                <div>
                  <h3>Learn Solidity</h3>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to </p>
                </div>
                <div>
                    <small>Blockchain</small>
                    <small>Joe Curry</small>
                    <small>12th August</small>
                </div>
              </span>
            </li>
            <li>
              <span className={styles.leftMainImg}></span>
              <span className={styles.leftMainCon}></span>
            </li>
            <li>
              <span className={styles.leftMainImg}></span>
              <span className={styles.leftMainCon}></span>
            </li>
          </ul>
        </div>
      </section>
      <section className={styles.indexRight}>
        <div className={styles.searchContainer}>
          <div></div>
        </div>
      </section>
    </div>
  )
}
