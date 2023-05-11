import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner';
import Image from 'next/image';
import Card from '@/components/card';
import coffeeStoresList from '../data/coffee-stores.json';

export async function getStaticProps(context) {
  console.log('this console wont come in browser');
  return {
    props: { coffeeStores: coffeeStoresList }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { coffeeStores } = props;
  const handleOnBannerBtnClick = () => {
    console.log('button clicked');
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Cafes</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText='View stores nearby'
          handleOnClick={handleOnBannerBtnClick}
        />
        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            width={700}
            height={400}
            alt='background image'
          />
        </div>
        <div className={styles.cardLayout}>
          {coffeeStores.map((coffeeStore) => {
            const { name, id, imgUrl } = coffeeStore;
            return (
              <Card
                name={name}
                key={coffeeStore.id}
                imgUrl={imgUrl}
                href={`/coffee-store/${id}`}
                className={styles.card}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
