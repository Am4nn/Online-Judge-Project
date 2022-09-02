import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/auth-actions"
import AccountMenu from "./AccountMenu/AccountMenu"
import "./style.css"

const NavBar = () => {
    const [expand, setExpand] = useState(false);
    const loginState = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const logoutHandler = () => {
        if (loginState.isLoading) return;
        dispatch(logout());
    }

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
                            <AccountMenu
                                expand={expand}
                                setExpand={setExpand}
                                loginState={loginState}
                                logoutHandler={logoutHandler}
                            />
                        </Nav.Item>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}

export default NavBar;
