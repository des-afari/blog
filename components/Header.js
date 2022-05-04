import Head from 'next/head'
import Image from 'next/image'
import Write from '../public/svg/write.svg'
import styles from '../styles/Header.module.css'

export default function Header(){
    return(
        
        <header className={styles.header}>
            
            <div>
                <p>blog.</p>
            </div>
            <nav>
                <i>
                    <Image src={Write} alt='write' width={32} height={32} />
                </i>
            </nav>
        </header>
    )
}