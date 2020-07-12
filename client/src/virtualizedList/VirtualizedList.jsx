import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './VirtualizedList.scss';

const VirtualizedListItem = ({ children, top, height }) => (
  <div className="virtualized-list__item" style={{ top, height }}>{children}</div>
)

const VirtualizedList = ({ items, className, renderItem: Item, itemHeight, renderContainer: Container }) => {
  const [start, setStart] = useState(0);
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

  const viewPortRef = useCallback(element => {
    if (element) {
      setViewPortHeight(element.clientHeight);
    }
  }, [])

  const viewPortStyle = useMemo(
    () => viewPortHeight ? ({height: viewPortHeight}) : {},
    [viewPortHeight]
  );

  return (
    <div className={`virtualized-list ${className}`} onScroll={onScroll} ref={viewPortRef} style={viewPortStyle}>
      {viewPortHeight ? (
        <Container className="virtualized-list__container" style={{ height: items.length * itemHeight }}>
          {items.slice(start, end).map((item, index) =>
            <Item
              item={item}
              className="virtualized-list__item" style={{ top: (start + index) * itemHeight }}
              key={index}/>
          )}
        </Container>
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