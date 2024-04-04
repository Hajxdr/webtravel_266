import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import api, { ApiResponse } from '../../API/api';
import { ApiConfig } from '../../Config/ApiConfig';
import TripType from '../../Types/trips.type';

const HomePage: React.FC = () => {
    const [tripData, setTripData] = useState<TripType[] | null>(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response: ApiResponse<TripType[]> = await api('/trips', 'get');
                if (response.status === 'ok' && response.data) {
                    setTripData(response.data);
                } else {
                    console.error('Greška prilikom dohvaćanja podataka:', response.data);
                }
            } catch (error) {
                console.error('Greška prilikom dohvaćanja podataka:', error);
            }
        };

        fetchTrips();
    }, []);

    function formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-US');
    }
    
    return (
        <Container fluid="xxl">
            <Row  className='justify-content-md-center'>
                {tripData ? tripData.map(trip => (
                    <Col lg={3} key={trip.id} md={4} className="mb-4">
                        <Card style={{width:"300px", minHeight:"470px"}}>
                        <Card.Img variant='top' src={ApiConfig.PHOTO_PATH + "small_" + trip.image_path}></Card.Img>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '8px'}}>
                                <div className='badge bg-danger text-wrap float-end text-end'>
                                    <div>Datum polaska: {trip.start_date ? formatDate(trip.start_date) : 'N/A'}</div>
                                    <div>Datum povratka: {trip.end_date ? formatDate(trip.end_date) : 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                        <Card.Body className='d-flex flex-column'>
                            <Card.Title>{trip.name}</Card.Title>
                            <Card.Text>{trip.description ? trip.description.slice(0, 160) + (trip.description.length > 160 ? "..." : "") : 'N/A'}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <Button variant="primary">Detalji</Button>
                        </Card.Footer>
                    </Card>
                    </Col>
                )) : <Spinner animation="border" variant="warning" />}
            </Row>
        </Container>
    )
};

export default HomePage;
