import styles from './banner.module.css';

const Banner = ({ buttonText, handleOnClick }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Cafes</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shops!</p>
      <button onClick={handleOnClick} className={styles.button}>
        {' '}
        {buttonText}{' '}
      </button>
    </div>
  );
};

export default Banner;
