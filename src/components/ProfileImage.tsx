import { css } from '@emotion/react';

interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const sizes: Record<'sm' | 'md' | 'lg' | 'xl' | 'xxl', number> = {
  sm: 32,
  md: 48,
  lg: 56,
  xl: 96,
  xxl: 120,
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  size = 'md',
}) => (
  <div
    css={css`
      width: ${sizes[size]}px;
      height: ${sizes[size]}px;
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
    `}
  >
    <img
      src={src}
      alt={alt}
      css={css`
        width: 100%;
        height: 100%;
        object-fit: cover;
      `}
    />
  </div>
);

export default ProfileImage;
