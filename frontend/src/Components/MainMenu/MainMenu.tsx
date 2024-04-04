import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/store';
import { setUserRole } from "../../Redux/set.user.role.action";

export class MainMenuItem {
    text: string;
    link: string;

    constructor(text: string, link: string){
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties {
    userItems: MainMenuItem[];
    adminItems: MainMenuItem[];
    isAdmin: boolean;
}

const mapStateToProps = (state: RootState) => ({
    isAdmin: state.userRole.userRole === 'admin'
});

export function MainMenu(props: MainMenuProperties) {
    const [items, setItems] = useState(props.userItems);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.isAdmin) {
            setItems(props.adminItems);
        } else {
            setItems(props.userItems);
        }
    }, [props.isAdmin, props.userItems, props.adminItems]);

    useEffect(() => {
        const roleFromCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('userRole='))
            ?.split('=')[1];
        
        if (roleFromCookie) {
            dispatch(setUserRole(roleFromCookie));
        }
    }, [dispatch]);

    return ( 
        <Navbar 
            className="bg-body-tertiary mb-3" 
            sticky="top" 
            expand="lg" 
            collapseOnSelect={false}>
            <Container>
                <Navbar.Brand as={Link} to="/">Web Travel</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='me-auto'>
                        {items.map(makeNavLink)}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

    function makeNavLink(item: MainMenuItem){
        return (
            <Nav.Link as={Link} key={item.text} to={item.link}>{item.text}</Nav.Link>
        ); 
    }
}

export default connect(mapStateToProps)(MainMenu);
