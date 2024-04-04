import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import api, { ApiResponse } from '../../../API/api';
import CategoryType from '../../../Types/category.type';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';

const AddNewTrip: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const userId = useSelector((state: RootState) => state.userRole.userId);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('categoryId', categoryId);
            formData.append('authorId', userId);
            if (photo) {
                formData.append('photo', photo);
            }

            const response = await api<{ id: string }>(
                '/trips',
                'post',
                formData
            );

            if (response.status === 'ok') {
                setSuccess(true);
            } else {
                setError('Greška prilikom dodavanja novog putovanja!');
            }
        } catch (error) {
            setError('Greška prilikom dodavanja novog putovanja!');
        }

        setLoading(false);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response: ApiResponse<CategoryType[]> = await api('/categories', 'get');
                if (response.status === 'ok' && response.data) {
                    setCategories(response.data);
                } else {
                    setError('Greška prilikom dohvaćanja kategorija!');
                }
            } catch (error) {
                setError('Greška prilikom dohvaćanja kategorija!');
            }
        };
        fetchCategories();
    }, []);

    return (
        <Container fluid="xxl">
            <Row className='justify-content-md-center'>
                <Col lg={6} md={12} className="mb-4">
                    <Card>
                    <Form onSubmit={handleSubmit}>
                        <Card.Header as="h5">Dodaj novo putovanje</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">Putovanje je uspješno kreirano!</Alert>}
                                <Form.Group controlId="formName">
                                    <Form.Label>Naziv</Form.Label>
                                    <Form.Control type="text" placeholder="Upišite naziv" value={name} onChange={(e) => setName(e.target.value)} required />
                                </Form.Group>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Opis</Form.Label>
                                    <Form.Control as="textarea" placeholder="Upišite opis" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                </Form.Group>
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Datum polaska</Form.Label>
                                    <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                                </Form.Group>
                                <Form.Group controlId="formEndDate">
                                    <Form.Label>Datum povratka</Form.Label>
                                    <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                                </Form.Group>
                                <Form.Group controlId="formCategoryId">
                                <Form.Label>Kategorija</Form.Label>
                                <Form.Control as="select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                        <option value="">Odaberite kategoriju</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formPhoto">
                                    <Form.Label>Cover</Form.Label>
                                    <Form.Control 
                                    type="file" 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setPhoto(e.target.files[0]);
                                        } else {
                                            setPhoto(null);
                                        }
                                    }} 
                                />
                                </Form.Group>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Dodaj'}
                            </Button>
                        </Card.Footer>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddNewTrip;
