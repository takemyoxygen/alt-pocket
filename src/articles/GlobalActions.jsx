import React from 'react';
import {TiPencil} from 'react-icons/ti';
import {MdCloudDownload, MdRefresh} from 'react-icons/md';
import {IoIosLogOut} from 'react-icons/io';
import {connect} from 'react-redux';
import actions from '../actions';
import './GlobalActions.scss';

const GlobalActions = ({bulkEditEnabled, onBulkToggled, sync, reloadAll, logout}) => (
  <div className="global-operations">
  <TiPencil
    title="Bulk edit"
    className={bulkEditEnabled ? 'bulk-edit-icon--enabled' : ''}
    onClick={onBulkToggled}
  />
  <MdCloudDownload title="Sync" onClick={sync}/>
  <MdRefresh title="Reload all" onClick={reloadAll} />
  <IoIosLogOut title="Log out" onClick={logout}/>
</div>
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
