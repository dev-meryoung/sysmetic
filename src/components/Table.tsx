import { useState, ReactNode } from 'react';
import { css } from '@emotion/react';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import Checkbox from '@/components/Checkbox';
import IconButton from '@/components/IconButton';
import { COLOR } from '@/constants/color';

interface ColumnProps<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnProps<T>[];
  hasCheckbox?: boolean;
  checkedItems?: number[];
  handleCheckboxChange?: (index: number) => void;
  handleHeaderCheckboxChange?: (checked: boolean) => void;
}

const Table = <T,>({
  data,
  columns,
  hasCheckbox = false,
  checkedItems,
  handleCheckboxChange,
  handleHeaderCheckboxChange,
}: TableProps<T>) => {
  const isAllChecked = checkedItems?.length === data.length;

  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null); // 초기값을 null로 설정하여 정렬 미적용

  const handleSort = (key: keyof T) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === 'asc' // 수정
          ? 'desc'
          : 'asc',
    }));
  };

  const sortedData = sortConfig
    ? [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : data;

  const handleHeaderCheckboxClick = (checked: boolean) => {
    handleHeaderCheckboxChange?.(checked);
  };

  const handleRowCheckboxClick = (index: number) => {
    handleCheckboxChange?.(index);
  };

  return (
    <table css={tableStyle}>
      <thead>
        <tr>
          {hasCheckbox && (
            <th>
              <Checkbox
                checked={isAllChecked}
                handleChange={handleHeaderCheckboxClick}
              />
            </th>
          )}
          {columns.map((column) => (
            <th key={column.key as string}>
              <div css={headerContentStyle}>
                {column.header}
                {column.sortable && (
                  <IconButton
                    IconComponent={
                      sortConfig?.key === column.key
                        ? sortConfig.direction === 'asc'
                          ? ArrowDropUpOutlinedIcon
                          : ArrowDropDownOutlinedIcon
                        : UnfoldMoreOutlinedIcon
                    }
                    shape='none'
                    handleClick={() => handleSort(column.key)}
                  />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item, index) => (
          <tr key={index}>
            {hasCheckbox && (
              <td>
                <Checkbox
                  checked={checkedItems?.includes(index) ?? false}
                  handleChange={() => handleRowCheckboxClick(index)}
                />
              </td>
            )}
            {columns.map((column) => (
              <td key={column.key as string}>
                {column.render
                  ? column.render(item[column.key], item)
                  : String(item[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const tableStyle = css`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${COLOR.GRAY100};
  }

  th,
  td {
    padding: 16px;
    vertical-align: middle;
    text-align: center;
  }

  tr {
    position: relative;

    td::after {
      content: '';
      position: absolute;
      height: 1px;
      background-color: ${COLOR.GRAY};
      width: 100%;
      left: 0;
      bottom: 0;
    }
  }
`;

const headerContentStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export default Table;
