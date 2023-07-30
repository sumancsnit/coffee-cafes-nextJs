import Link from 'next/link';
import moment from 'moment';
import { ThreeDots, RotatingLines } from 'react-loader-spinner';
import useSWR from 'swr';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cls from 'classnames';
import Head from 'next/head';
import styles from '../../styles/coffee-store.module.css';
import Image from 'next/image';
import { fetchCoffeeStores } from '@/lib/coffee-store';
import { isEmpty, fetcher } from '../../utils';
import { StoreContext } from '../../store/store-context';

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(staticProps) {
  const { params } = staticProps;
  const coffeeStoresList = (await fetchCoffeeStores()) || [];
  const findCoffeeStoreById =
    coffeeStoresList.find((list) => {
      return list.id == params.id;
    }) || {};
  return {
    props: {
      coffeeStore: findCoffeeStoreById,
    }, // will be passed to the page component as props
  };
}

export async function getStaticPaths() {
  const coffeeStores = (await fetchCoffeeStores()) || [];
  const paths = coffeeStores.map((list) => {
    return {
      params: {
        id: list.id + '',
      },
    };
  });
  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const [loader, setLoader] = useState(true);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore = {}) => {
    setLoader(true);
    try {
      const { id, name, voting, imgUrl, neighbourhood, address, latLon } =
        coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          voting: voting ?? 0,
          imgUrl,
          neighbourhood: neighbourhood || '',
          address: address || '',
          latLon,
          createdOn: moment().format('MMMM D YYYY, h:mm a'),
        }),
      });

      // await response.json();
    } catch (err) {
      console.error('Error creating coffee store', err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        if (findStoreFromContext) {
          setCoffeeStore(findStoreFromContext);
          handleCreateCoffeeStore(findStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialProps.coffeeStore]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
      setLoader(false);
    }
    if (error) {
      console.log('swr error:', error);
      setLoader(false);
    }
  }, [data, error]);

  const handleUpvoteButton = async () => {
    setLoader(true);
    try {
      const response = await fetch('/api/upVoteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          updatedOn: moment().format('MMMM D YYYY, h:mm a'),
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore?.length) {
        setVotingCount((count) => count + 1);
      }
    } catch (error) {
      console.error('Error upvoting the coffee store', error);
    } finally {
      setLoader(false);
    }
  };

  const { name, address, neighbourhood, imgUrl } = coffeeStore ?? {};

  // if (error) {
  //   return <div>Something went wrong retrieving coffee store page</div>;
  // }

  if (router.isFallback) {
    return (
      <div className={styles.loaderWrapper}>
        <RotatingLines
          strokeColor='grey'
          strokeWidth='5'
          animationDuration='0.75'
          width='96'
          visible={true}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name='description' content={`${name} coffee cafe`}></meta>
      </Head>
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
      <div className={styles.layout}>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link className={styles.hrefLink} href='/'>
                {' '}
                <Image
                  src='/static/icons/arrow_back.svg'
                  width={24}
                  height={24}
                  alt='i'
                />{' '}
                Back to home{' '}
              </Link>
            </div>
            <div className={styles.nameWrapper}>
              <p className={styles.name}>{name}</p>
            </div>
            <Image
              src={
                imgUrl ||
                'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
              }
              alt={name || 'image'}
              width={600}
              height={360}
              className={styles.storeImg}
            />
          </div>
          <div className={cls('glass', styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/nearMe.svg'
                width={24}
                height={24}
                alt='i'
              />
              <p className={styles.text}>{address}</p>
            </div>
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/places.svg'
                width={24}
                height={24}
                alt='i'
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/star.svg'
                width={24}
                height={24}
                alt='i'
              />
              <p className={styles.text}>{votingCount} </p>
              <ThreeDots
                height='10'
                width='40'
                radius='9'
                color='#4fa94d'
                ariaLabel='three-dots-loading'
                wrapperStyle={{ paddingLeft: 8 }}
                wrapperClassName=''
                visible={loader}
              />
            </div>

            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
              disabled={loader}
            >
              Up vote!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoffeeStore;
