import styles from '../styles/Index.module.css'
import A1 from '../public/img/a1.jpg'
import A2 from '../public/img/a2.jpg'
import A3 from '../public/img/a3.jpg'
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
                {/* 200x150 */}
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
              <span className={styles.leftMainImg}>
                {/* 200x150 */}
                <Image src={A2} alt='a2' placeholder='blur'></Image>
              </span>
              <span className={styles.leftMainCon}>
                <div>
                  <h3>The Pursuit Of Happiness Is Dog-Shit</h3>
                  <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed</p>
                </div>
                <div>
                    <small>Motivational</small>
                    <small>Kim Gerber</small>
                    <small>30th May</small>
                </div>
              </span>
            </li>
            <li>
              <span className={styles.leftMainImg}>
                {/* 200x150 */}
                <Image src={A3} alt='a3' placeholder='blur'></Image>
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
