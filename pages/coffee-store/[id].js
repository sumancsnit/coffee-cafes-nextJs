import Link from 'next/link';
import { useRouter } from 'next/router';
import cls from 'classnames';
import Head from 'next/head';
import coffeeStoresList from '../../data/coffee-stores.json';
import styles from '../../styles/coffee-store.module.css';
import Image from 'next/image';
import { fetchCoffeeStores } from '@/lib/coffee-store';

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(staticProps) {
  console.log(
    '🚀 ~ file: [id].js:12 ~ getStaticProps ~ staticProps:',
    staticProps
  );
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
  console.log('🚀 ~ file: [id].js:32 ~ paths ~ paths:', paths);
  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  const { name, imgUrl, address, neighbourhood } = props.coffeeStore || {};

  const handleUpvoteButton = () => {};

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
