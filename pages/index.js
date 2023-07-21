import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner';
import Image from 'next/image';
import Card from '@/components/card';
import { fetchCoffeeStores } from '@/lib/coffee-store';
import useTrackLocation from '@/hooks/useTrackLocation';
import { useEffect, useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps(context) {
  console.log('this console wont come in browser');
  const coffeeStoresList = (await fetchCoffeeStores()) || [];

  return {
    props: { coffeeStores: coffeeStoresList, images: [] }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  // const { coffeeStores } = props;
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  const [coffeeFetchError, setCoffeeFetchError] = useState('');
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    const getCoffeeStores = async () => {
      const { latitude, longitude } = latLong;
      try {
        // const fetchedCoffeeStores = await fetchCoffeeStores(
        //   latitude,
        //   longitude
        // );

        const response = await fetch(
          `/api/getCoffeeStoresByLocation?lat=${latitude}&lon=${longitude}&limit=9`
        );

        const coffeeStores = await response.json();

        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: {
            coffeeStores,
          },
        });
        setCoffeeFetchError('');
      } catch (error) {
        console.log({ error });
        setCoffeeFetchError(error.message);
      }
    };
    if (latLong) {
      getCoffeeStores();
    }
  }, [dispatch, latLong]);

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
        {coffeeFetchError && <p> Something went wrong: {coffeeFetchError} </p>}
        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            width={700}
            height={400}
            alt='background image'
          />
        </div>
        {!!coffeeStores?.length && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}> Stores Near Me </h2>
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
        {!!props.coffeeStores?.length && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}> Chennai stores </h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
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
