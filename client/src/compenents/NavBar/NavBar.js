import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { Link } from "react-router-dom"
import AccountMenu from "./AccountMenu/AccountMenu"
import "./style.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ClickAwayListener } from "@mui/material"
import ExtraMenu from "./ExtraMenu/ExtraMenu"

const NavBar = () => {
    const [expand, setExpand] = useState(false);

    const handleNavBarClickAway = () => {
        setExpand(false);
    }

    return (
        <ClickAwayListener onClickAway={handleNavBarClickAway}>
            <Navbar
                expanded={expand}
                fixed="top"
                expand="md"
                className='navbar navfontfamily bg-dark'
            >
                <Container>
                    <Navbar.Brand href="/" className="d-flex">
                        <span className='nav_ac navbar-brand' to="/">
                            <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '0.5rem' }} />
                            OJ
                            <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: '0.5rem' }} />
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
                            {/* <Nav.Item>
                            <Nav.Link
                                as={Link}
                                to="/"
                                onClick={() => setExpand(false)}
                                className='myNavLink'
                            >
                                Home
                            </Nav.Link>
                        </Nav.Item> */}

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

                            <Nav.Item>
                                <AccountMenu setExpand={setExpand} />
                            </Nav.Item>

                            <Nav.Item>
                                <ExtraMenu setExpand={setExpand} />
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        </ClickAwayListener>
    );
}

export default NavBar;
