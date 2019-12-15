import React, {useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';

const VirtualizedList = ({items, className, renderItem, visibleItemsCount, itemHeight}) => {
  const container = useRef();

  const [itemsToSkip, setItemsToSkip] = useState(0);

  const topSpace = useMemo(
    () => itemsToSkip * itemHeight,
    [itemsToSkip, itemHeight]
  );

  const bottomSpace = useMemo(
    () => itemHeight * Math.max(items.length - visibleItemsCount - itemsToSkip - 2, 0),
    [items.length, visibleItemsCount, itemHeight, itemsToSkip]
  );

  const dataSpace = useMemo(
    () => itemHeight * Math.min(items.length, visibleItemsCount + 2),
    [itemHeight, items.length, visibleItemsCount]
  );

  function onScroll(evt) {
    const offset = evt.target.scrollTop;
    const newItemsToSkip = Math.floor(offset / itemHeight);
    console.log('Offset: ', offset, ', items to skip: ', newItemsToSkip);
    setItemsToSkip(newItemsToSkip);
  }

  console.log({itemsToSkip, topSpace, bottomSpace, dataSpace});

  return (
    <div className={className} style={{height: dataSpace}} ref={container} onScroll={onScroll}>
      {<div key="top-space" style={{height: topSpace}}></div>}
      {items.slice(itemsToSkip, itemsToSkip + visibleItemsCount + 2).map((item, index) => <div key={index}>{renderItem(item)}</div>)}
      {<div key="bottom-space" style={{height: bottomSpace}}></div>}
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