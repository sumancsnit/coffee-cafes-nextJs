import Link from 'next/link';
import { useRouter } from 'next/router';
import coffeeStoresList from '../../data/coffee-stores.json';

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '0' } }, { params: { id: '1' } }],
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  const { params } = context;
  return {
    props: {
      coffeeStore: coffeeStoresList.find((list) => {
        return list.id == params.id;
      }),
    }, // will be passed to the page component as props
  };
}

const CoffeeStore = (props) => {
  const { name, imgUrl, address, neighbourhood } = props.coffeeStore;
  const router = useRouter();

  return (
    <div>
      Coffee Store Page {router.query.id}
      <Link href='/'>Back to home</Link>
      <Link href='/coffee-store/dynamic'> Go to page dynamic </Link>
      <p>{name}</p>
      <p>{address}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};

export default CoffeeStore;
