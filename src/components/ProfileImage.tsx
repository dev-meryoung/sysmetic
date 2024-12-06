import { css } from '@emotion/react';
import defaultProfile from '@/assets/images/default-profile.png';

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
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
  src = defaultProfile,
  alt = 'profile',
  size = 'md',
}) => (
  <div
    css={css`
      min-width: ${sizes[size]}px;
      min-height: ${sizes[size]}px;
      max-width: ${sizes[size]}px;
      max-height: ${sizes[size]}px;
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
    `}
  >
    <img
      src={src || defaultProfile}
      alt={alt}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = defaultProfile;
      }}
      css={css`
        width: 100%;
        height: 100%;
        object-fit: cover;
      `}
    />
  </div>
);

export default ProfileImage;
