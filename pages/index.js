import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner';
import Image from 'next/image';
import Card from '@/components/card';
import { fetchCoffeeStores } from '@/lib/coffee-store';
import useTrackLocation from '@/hooks/useTrackLocation';

export async function getStaticProps(context) {
  console.log('this console wont come in browser');
  const coffeeStoresList = (await fetchCoffeeStores()) || [];

  return {
    props: { coffeeStores: coffeeStoresList, images: [] }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { coffeeStores } = props;
  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  console.log(
    '🚀 ~ file: index.js:21 ~ Home ~ locationErrorMsg:',
    locationErrorMsg
  );
  console.log('🚀 ~ file: index.js:21 ~ Home ~ latLong:', latLong);
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Cafes</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p> Something went wrong: {locationErrorMsg} </p>}
        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            width={700}
            height={400}
            alt='background image'
          />
        </div>
        {!!coffeeStores.length && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}> Bengaluru stores </h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore) => {
                  const { name, id, imgUrl } = coffeeStore;
                  return (
                    <Card
                      name={name}
                      key={id}
                      imgUrl={imgUrl}
                      href={`/coffee-store/${id}`}
                      className={styles.card}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
