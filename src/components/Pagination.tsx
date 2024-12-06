import { Dispatch, SetStateAction, useState } from 'react';
import { css } from '@emotion/react';
import {
  KeyboardDoubleArrowLeft,
  KeyboardArrowLeft,
  KeyboardDoubleArrowRight,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { COLOR } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  handlePageChange: Dispatch<SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPage,
  currentPage,
  handlePageChange,
}) => {
  const PAGE_PER_GROUP = 10;
  const [pageGroup, setPageGroup] = useState(0);

  const startPage = pageGroup * PAGE_PER_GROUP;
  const endPage = Math.min(startPage + PAGE_PER_GROUP - 1, totalPage - 1);
  const maxPageGroup = Math.floor((totalPage - 1) / PAGE_PER_GROUP);

  const handlePreviousGroup = () => {
    if (pageGroup > 0) {
      setPageGroup(pageGroup - 1);
      handlePageChange(startPage - 1);
    } else {
      handlePageChange(startPage);
    }
  };

  const handleNextGroup = () => {
    if (pageGroup < maxPageGroup) {
      setPageGroup(pageGroup + 1);
      handlePageChange(startPage + PAGE_PER_GROUP);
    } else {
      handlePageChange(totalPage - 1);
    }
  };

  return (
    <ul css={paginationStyle}>
      <li
        className='page-button'
        onClick={() => {
          handlePageChange(0);
          setPageGroup(0);
        }}
      >
        <KeyboardDoubleArrowLeft />
      </li>
      <li className='page-button' onClick={handlePreviousGroup}>
        <KeyboardArrowLeft />
      </li>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const pageIndex = startPage + index;
        return (
          <li
            key={pageIndex}
            className={`page-button ${currentPage === pageIndex ? 'active' : ''}`}
            onClick={() => handlePageChange(pageIndex)}
          >
            {pageIndex + 1}
          </li>
        );
      })}
      <li className='page-button' onClick={handleNextGroup}>
        <KeyboardArrowRight />
      </li>
      <li
        className='page-button'
        onClick={() => {
          handlePageChange(totalPage - 1);
          setPageGroup(maxPageGroup);
        }}
      >
        <KeyboardDoubleArrowRight />
      </li>
    </ul>
  );
};

const paginationStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${FONT_SIZE.TEXT_SM};
  gap: 4px;

  .page-button {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 24px;
    height: 24px;
    padding: 0 4px;

    :hover {
      cursor: pointer;
      color: ${COLOR.PRIMARY};
    }

    svg {
      font-size: 20px;
    }
  }

  .active {
    color: ${COLOR.PRIMARY};
    border: 1px solid ${COLOR.PRIMARY};
    border-radius: 4px;
  }
`;

export default Pagination;
