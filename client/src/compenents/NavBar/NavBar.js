import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import "./style.css"
import { Link } from "react-router-dom"

const NavBar = () => {
    const [expand, setExpand] = useState(false);

    return (
        <Navbar
            expanded={expand}
            fixed="top"
            expand="md"
            className='navbar navfontfamily bg-dark'
        >
            <Container>
                <Navbar.Brand href="/" className="d-flex">
                    <span className='nav_ac navbar-brand' to="/">
                        OJ
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    onClick={() => {
                        setExpand(expand ? false : "expanded");
                    }}
                >
                </Navbar.Toggle>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto" defaultActiveKey="#home">
                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/"
                                onClick={() => setExpand(false)}
                                className='myNavLink'
                            >
                                Home
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/questions"
                                onClick={() => setExpand(false)}
                                className='myNavLink'
                            >
                                Practice
                            </Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/leaderboard"
                                onClick={() => setExpand(false)}
                                className='myNavLink'
                            >
                                LeaderBoard
                            </Nav.Link>
                        </Nav.Item>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}

export default NavBar;
