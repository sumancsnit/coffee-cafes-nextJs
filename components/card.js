import Image from 'next/image';
import Link from 'next/link';
import styles from './card.module.css';
import cls from 'classnames';

const card = (props) => {
  const { name, imgUrl, href } = props;
  return (
    <Link href={href} className={styles.cardLink}>
      <div className={cls('glass', styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 lassName={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image src={imgUrl} alt='Card Image' width={260} height={160} />
        </div>
      </div>
    </Link>
  );
};

export default card;
