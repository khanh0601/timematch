import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { REGEX } from '../../../../constant';

const { Option } = Select;

const SelectSizeText = ({
  valSelect,
  objStyle,
  updateStyle,
  classStyle,
  name,
}) => {
  const [listValHeightWidth, setListValHeightWidth] = useState([]);
  const [valSearch, setValSearch] = useState('');
  useEffect(() => {
    const listHeightWidth = [];
    let length = 500;
    // if (name === 'fontSize') {
    //   length = 15;
    // }
    for (let i = 1; i < length; i++) {
      listHeightWidth.push({ id: i, val: i + 'px', title: i + 'px' });
    }
    setListValHeightWidth(listHeightWidth);
  }, []);

  const onSearchData = value => {
    if (value) {
      // if (
      //   name === 'fontSize' &&
      //   !new RegExp(REGEX.minFontSize).test(value) &&
      //   !new RegExp(REGEX.maxFontSize).test(value)
      // ) {
      //   return;
      // }

      if (
        // name !== 'fontSize' &&
        !new RegExp(REGEX.stringNumberTemplate).test(value)
      ) {
        return;
      }
    }

    if (!value) {
      setValSearch('');
      return;
    }

    setValSearch(value);
    const listFilter = listValHeightWidth.filter(
      item => item.val.indexOf(value) >= 0,
    );
    if (!listFilter.length) {
      updateStyle(name, value + 'px');
    }
  };

  return (
    <Select
      showSearch
      value={valSelect}
      className={classStyle ? classStyle : ''}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      searchValue={valSearch}
      onChange={e => {
        updateStyle(name, e);
      }}
      onSearch={onSearchData}
      onBlur={() => {
        setValSearch('');
      }}
    >
      {listValHeightWidth.map((item, key) => (
        <Option key={key} value={item.val}>
          {item.title}
        </Option>
      ))}
    </Select>
  );
};

export default SelectSizeText;
