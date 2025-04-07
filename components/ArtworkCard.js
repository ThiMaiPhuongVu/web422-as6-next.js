import useSWR from 'swr';
import Link from 'next/link';
import Error from 'next/error';
import { Card, Button } from 'react-bootstrap';
import styles from '@/styles/ArtworkCard.module.css';


export default function ArtworkCard(props) {
    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null);

    if (error) return <Error statusCode={404} />;
    if (!data) return null;

    return (

        <Card>
            <Card.Img src={data.primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]'} />
            <Card.Body>
                <Card.Title>{data.title || 'N/A'}</Card.Title>
                <Card.Text>
                    Date: {data.objectDate || 'N/A'} <br />
                    Classification: {data.classification || 'N/A'} <br />
                    Medium: {data.medium || 'N/A'}
                </Card.Text>
                <Link href={`/artwork/${props.objectID}`} passHref>
                    <Button variant="primary" className={styles.customButton}>{props.objectID}</Button>
                </Link>
            </Card.Body>
        </Card>
    );
}