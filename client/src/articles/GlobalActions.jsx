import React from 'react';
import {FaPencilAlt, FaSignOutAlt, FaSyncAlt, FaCloudDownloadAlt} from 'react-icons/fa';
import {connect} from 'react-redux';
import actions from '../actions';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'
import './GlobalActions.scss';

const GlobalActions = ({bulkEditEnabled, onBulkToggled, sync, reloadAll, logout}) => (
  <Navbar bg="light" variant="light" className="header">
    <Navbar.Brand className="mr-auto">Alt. Pocket</Navbar.Brand>
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

export default connect(
  state => ({
    bulkEditEnabled: state.bulkEdit.enabled
  }),
  {
    onBulkToggled: actions.toggleBulkEdit,
    reloadAll: actions.reloadAll,
    sync: actions.sync,
    logout: actions.logout
  })(GlobalActions);
