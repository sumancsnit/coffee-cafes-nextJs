import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cls from 'classnames';
import Head from 'next/head';
import styles from '../../styles/coffee-store.module.css';
import Image from 'next/image';
import { fetchCoffeeStores } from '@/lib/coffee-store';
import { isEmpty } from '../../utils';
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
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        setCoffeeStore(findCoffeeStoreById);
      }
    }
  }, [id]);

  const handleUpvoteButton = () => {};

  const { name, address, neighbourhood, imgUrl } = coffeeStore ?? {};

  if (router.isFallback) return <div>Loading...</div>;
  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.layout}>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href='/'>Back to home</Link>
            </div>
            <div className={styles.nameWrapper}>
              <p className={styles.name}>{name}</p>
            </div>
            <Image
              src={
                imgUrl ||
                'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
              }
              alt={name}
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
              <p className={styles.text}>1</p>
            </div>

            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}
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
