import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Banner from '../components/Banner/Banner';
import Card from '../components/Card/Card';
import { getCoffeeStoresWithImages } from '../data/coffee-stores-api';
import useLocation from '../hooks/useLocation';
import { useEffect } from 'react';
import useFetchNearByCoffeeStores from '../hooks/useFetchNearByCoffeeStores';
import { useStoresLocationContext } from '../context/stores-location-context';

export default function Home({ coffeeStores }) {
  const {
    getLocation,
    loading: getLocationLoading,
    error: getLocationError,
  } = useLocation();

  const {
    loadingNearByCoffeeStores,
    errorFetchingNearByCoffeeStores,
    fetchNearByCoffeeStores,
  } = useFetchNearByCoffeeStores();

  const {
    state: { nearByCoffeeStores, location },
  } = useStoresLocationContext();

  useEffect(() => {
    if (location && (!nearByCoffeeStores || nearByCoffeeStores.length === 0)) {
      fetchNearByCoffeeStores(location, 30);
    }
  }, [location, nearByCoffeeStores, fetchNearByCoffeeStores]);

  const handleOnBannerBtnClick = () => {
    getLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          btnText={getLocationLoading ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        <p>{getLocationError && `Something went wrong: ${getLocationError}`}</p>
        <div className={styles.heroImage}>
          <Image src='/static/hero-image.png' width={700} height={400} alt='' />
        </div>

        {loadingNearByCoffeeStores && <p>Loading nearny coffee stores</p>}
        {errorFetchingNearByCoffeeStores && (
          <p>Error fetching nearny coffee stores</p>
        )}
        {nearByCoffeeStores && nearByCoffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Nearby Stores</h2>
            <div className={styles.cardLayout}>
              {nearByCoffeeStores.map((cs) => (
                <Card
                  key={cs.id}
                  href={`/coffee-store/${cs.id}`}
                  imgUrl={cs.imgUrl}
                  name={cs.name}
                />
              ))}
            </div>
          </div>
        )}
        {!coffeeStores && <p>Failed Loading Coffee Stores</p>}
        {coffeeStores && coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((cs) => (
                <Card
                  key={cs.id}
                  href={`/coffee-store/${cs.id}`}
                  imgUrl={cs.imgUrl}
                  name={cs.name}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  try {
    const coffeeStores = await getCoffeeStoresWithImages();
    return {
      props: { coffeeStores },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { coffeeStores: null },
    };
  }
}