import React, {useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import './VirtualizedList.scss';

const VirtualizedListItem = ({children, top, height}) => (
  <div className="virtualized-list__item" style={{top, height}}>{children}</div>
)

const VirtualizedList = ({items, className, renderItem, visibleItemsCount, itemHeight}) => {

  const [start, setStart] = useState(0);

  const end = useMemo(
    () => Math.min(start + visibleItemsCount, items.length),
    [start, items.length, visibleItemsCount]
  )

  function onScroll(evt) {
    const offset = Math.floor(evt.target.scrollTop / itemHeight);
    const newStart = offset + visibleItemsCount > items.length ? items.length - visibleItemsCount : offset
    requestAnimationFrame(() => setStart(newStart));
  }

  return (
    <div className="virtualized-list" onScroll={onScroll} style={{height: visibleItemsCount * itemHeight}}>
      <div className="virtualized-list__container" style={{height: items.length * itemHeight}}>
      {items.slice(start, end).map((item, index) =>
        <VirtualizedListItem
          key={index}
          top={(start + index) * itemHeight}>
            {renderItem(item)}
          </VirtualizedListItem>
      )}
      </div>
    </div>
  )
}

VirtualizedList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  visibleItemsCount: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired
};

export default VirtualizedList;