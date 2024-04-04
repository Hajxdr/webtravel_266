// LoginPage.tsx

import { useEffect, useState } from 'react';
import { Button, Card, FormControl, FormGroup, FormLabel, Form, Container, Row, Col, Alert } from "react-bootstrap";
import api from '../../API/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserRole } from '../../Redux/set.user.role.action';
import store from '../../Redux/store';
import { setUserId } from '../../Redux/set.user.id.action';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
            const response = await api('/login', 'post', { email, password });
    
            if (response.status === 'ok' && response.data.user) {
                if(response.data.user.status === "active"){
                    const role: string = response.data.user.role;
                    const userId: number = response.data.user.id;

                    dispatch(setUserRole(role));
                    dispatch(setUserId(userId));

                    document.cookie = `userRole=${role}`;
                    navigate("/");
                } else {
                    setMessage("Vaš korisnički nalog je neaktivan!")
                }
            } else {
                setMessage(response.data.message);
                console.error('Neuspješna prijava:', response.data.message);
            }
        } catch (error) {
            setMessage("Greška prilikom prijave:" + error);
            console.error('Greška prilikom prijave:', error);
        }
    };
    
    useEffect(() => {
        const roleFromRedux = store.getState().userRole;
        if (!roleFromRedux) {
            const userRoleCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('userRole='))
                ?.split('=')[1];
            if (userRoleCookie) {
                dispatch(setUserRole(userRoleCookie));
            }
        }
    }, [dispatch]);

    return (
        <Container className="justify-content-center" style={{ width: "450px" }}>
            <Row className="justify-content-center w-100">
                <Col>
                    <Card>
                        <Card.Header>
                            Prijavi se
                        </Card.Header>
                        <Form onSubmit={handleSubmit}>
                            <Card.Body>
                            {message && <Alert variant="danger">{message}</Alert>}
                                <FormGroup>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl
                                        id='prijava-email'
                                        type="email"
                                        placeholder="Upišite email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <FormLabel>Lozinka</FormLabel>
                                    <FormControl
                                        id='prijava-password'
                                        type="password"
                                        placeholder="Upišite lozinku"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormGroup>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="primary" type="submit">
                                    Prijavi se
                                </Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default LoginPage;
