import { css } from '@emotion/react';

interface TagProps {
  src: string;
  alt?: string;
}

const Tag: React.FC<TagProps> = ({ src, alt }) => (
  <img css={tagStyle} src={src} alt={alt ? alt : 'tag'} />
);

const tagStyle = css`
  display: inline-block;
  height: 16px;
`;

export default Tag;
