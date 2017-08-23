import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import { routeConfig } from '../routeConfig.js';

/*** Navbar components ***/

const ViewTab = props =>
    <li role="presentation" className={props.activeKey == props.id ? 'active' : ''}>
        <Link to={props.route} className="navbar-link">
            {props.label}
        </Link>
    </li>;

const ViewTabs = props => {
    let activeKey = props.appState.getSelectedNavTab();

    return (
        <ul className="nav navbar-nav navbar-left">
            <ViewTab activeKey={activeKey} {...routeConfig.admin} />
            <ViewTab activeKey={activeKey} {...routeConfig.cp} />
            <ViewTab activeKey={activeKey} {...routeConfig.ddah} />
        </ul>
    );
};

const Notifications = props => {
    let notifications = props.appState.getUnreadNotifications();

    return (
        <NavDropdown
            noCaret
            disabled={notifications.size == 0}
            title={
                <span>
                    <i className="fa fa-bell-o" style={{ fontSize: '16px' }} />&nbsp;{notifications.size}
                </span>
            }
            id="nav-notif-dropdown"
            onToggle={willOpen => {
                if (!willOpen) {
                    props.appState.readNotifications();
                }
            }}>
            {notifications.map((text, i) =>
                <MenuItem key={'notification-' + i} dangerouslySetInnerHTML={{ __html: text }} />
            )}
        </NavDropdown>
    );
};

const Auth = props =>
    <NavDropdown
        eventKey={routeConfig.logout.id}
        title={props.appState.getCurrentUserRole() + ':' + props.appState.getCurrentUserName()}
        id="nav-auth-dropdown">
        <MenuItem eventKey={routeConfig.logout.id + '.1'} href={routeConfig.logout.route}>
            Logout
        </MenuItem>
    </NavDropdown>;

/*** Navbar ***/

const NavbarInst = props =>
    <Navbar fixedTop fluid>
        <Navbar.Header>
            <Navbar.Brand>TAPP:CP</Navbar.Brand>
        </Navbar.Header>

        <ViewTabs {...props} />

        <Nav pullRight>
            <Notifications {...props} />
            <Auth {...props} />
        </Nav>
    </Navbar>;

export { NavbarInst as Navbar };
