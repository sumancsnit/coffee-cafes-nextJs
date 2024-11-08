import Head from 'next/head';
import moment from 'moment';
import ip from 'ip';
import styles from '@/styles/Home.module.css';
import { RotatingLines } from 'react-loader-spinner';
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
  const [loader, setLoader] = useState(false);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  useEffect(() => {
    const getCoffeeStores = async () => {
      setLoader(true);
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
        if (coffeeStores.length) handleCreateCoffeeStore(coffeeStores.at(0));
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
      } finally {
        setLoader(false);
      }
    };
    if (latLong) {
      getCoffeeStores();
    }
  }, [dispatch, latLong]);

  const handleCreateCoffeeStore = async (coffeeStore, name) => {
    try {
      const { id, voting, imgUrl, neighbourhood, address, latLon } =
        coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: moment().format('MMM-DD-YY-h:mm:ss-A'),
          name: name || 'new visitor',
          voting: 77777,
          imgUrl: '',
          neighbourhood: neighbourhood || '',
          address: address || '',
          latLon,
          createdOn: moment().format('MMMM D YYYY, h:mm a'),
        }),
      });

      // await response.json();
    } catch (err) {
      console.error('Error creating coffee store', err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleTrackLocation();
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (locationErrorMsg) {
      const ipAddress = ip.address();
      handleCreateCoffeeStore({ latLon: ipAddress }, 'ip-address');
    }
  }, [locationErrorMsg]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <>
      {loader && (
        <div className={styles.loaderWrapper}>
          <RotatingLines
            strokeColor='grey'
            strokeWidth='5'
            animationDuration='0.75'
            width='96'
            visible={true}
          />
        </div>
      )}
      <div className={styles.container}>
        <Head>
          <title>Coffee Cafes</title>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='description'
            content='discover coffee stores near you'
          ></meta>
        </Head>
        <p className={styles.userName}>Suman</p>
        <main className={styles.main}>
          <Banner
            buttonText={isFindingLocation ? 'Locating...' : 'View cafes nearby'}
            handleOnClick={handleOnBannerBtnClick}
          />
          {locationErrorMsg && (
            <p> Please grant location permission: {locationErrorMsg} </p>
          )}
          {coffeeFetchError && (
            <p> Something went wrong: {coffeeFetchError} </p>
          )}
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
                <h2 className={styles.heading2}>
                  Cafes Near Me
                  {` (${coffeeStores.at(0).localName || 'Your Location'})`}
                </h2>
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
                <h2 className={styles.heading2}> Cafes In Coorg </h2>
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
    </>
  );
}
