import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './VirtualizedList.scss';

const VirtualizedListItem = ({ children, top, height }) => (
  <div className="virtualized-list__item" style={{ top, height }}>{children}</div>
)

const VirtualizedList = ({ items, className, renderItem, itemHeight }) => {
  const [start, setStart] = useState(0);
  const viewPortRef = useRef(null);
  const [viewPortHeight, setViewPortHeight] = useState(null);

  const visibleItemsCount = useMemo(
    () => Math.min(Math.floor(viewPortHeight / itemHeight) + 1, items.length),
    [viewPortHeight, itemHeight, items.length]
  );

  const end = useMemo(
    () => Math.min(start + visibleItemsCount, items.length),
    [start, items.length, visibleItemsCount]
  )

  function onScroll(evt) {
    const offset = Math.floor(evt.target.scrollTop / itemHeight);
    const newStart = offset + visibleItemsCount > items.length ? items.length - visibleItemsCount : offset
    requestAnimationFrame(() => setStart(newStart));
  }

  // TODO use callback ref to get rid of the warning
  useEffect(() => {
    if (!viewPortHeight && viewPortRef.current) {
      setViewPortHeight(viewPortRef.current.clientHeight);
    }
  }, [viewPortHeight, viewPortRef.current]);

  const viewPortStyle = useMemo(
    () => viewPortHeight ? ({height: viewPortHeight}) : {},
    [viewPortHeight]
  );

  return (
    <div className={`virtualized-list ${className}`} onScroll={onScroll} ref={viewPortRef} style={viewPortStyle}>
      {viewPortHeight ? (
        <div className="virtualized-list__container" style={{ height: items.length * itemHeight }}>
          {items.slice(start, end).map((item, index) =>
            <VirtualizedListItem
              key={index}
              top={(start + index) * itemHeight}>
              {renderItem(item)}
            </VirtualizedListItem>
          )}
        </div>
        ) : null}
    </div>
  )
}

VirtualizedList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  itemHeight: PropTypes.number.isRequired
};

export default VirtualizedList;