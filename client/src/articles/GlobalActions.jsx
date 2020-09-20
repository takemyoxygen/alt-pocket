import React from 'react';
import {FaPencilAlt, FaSignOutAlt, FaSyncAlt, FaCloudDownloadAlt, FaArchive, FaPlus} from 'react-icons/fa';
import {connect} from 'react-redux';
import actions from '../actions';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'
import './GlobalActions.scss';
import {values} from 'lodash';
import {unread as unreadProjection} from '../projections';

const GlobalActions = ({bulkEditEnabled, onBulkToggled, sync, reloadAll, logout, unread, recentlyAdded, recentlyRead}) => (
  <Navbar bg="light" variant="light" className="header">
    <Navbar.Brand className="mr-auto">Alt. Pocket</Navbar.Brand>
    <Navbar.Text className="header__stats">Unread: {unread}</Navbar.Text>
    <Navbar.Text className="header__stats">
      Last 7 days:
      <FaPlus className="text-success"/>
      {recentlyAdded}
      <FaArchive className="text-primary"/>
      {recentlyRead}
    </Navbar.Text>
    <Nav>
      <NavDropdown title="Actions" id="basic-nav-dropdown">
        <NavDropdown.Item onClick={onBulkToggled} className="header__action">
          <FaPencilAlt/>
          {bulkEditEnabled ? 'Cancel bulk edit' : 'Bulk edit'}
          </NavDropdown.Item>
        <NavDropdown.Item onClick={sync} className="header__action">
          <FaSyncAlt/>
          Sync
        </NavDropdown.Item>
        <NavDropdown.Item onClick={reloadAll} className="header__action">
          <FaCloudDownloadAlt/>
          Reload all
        </NavDropdown.Item>
        <NavDropdown.Item onClick={logout} className="header__action">
          <FaSignOutAlt/>
          Logout
          </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  </Navbar>
)

const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

export default connect(
  state => ({
    bulkEditEnabled: state.bulkEdit.enabled,
    unread: values(state.articles).filter(unreadProjection.filter).length,
    recentlyAdded: values(state.articles).filter(article => article.addedAt >= weekAgo).length,
    recentlyRead: values(state.articles).filter(article => article.archivedAt >= weekAgo).length
  }),
  {
    onBulkToggled: actions.toggleBulkEdit,
    reloadAll: actions.reloadAll,
    sync: actions.sync,
    logout: actions.logout
  })(GlobalActions);
