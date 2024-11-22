import { FaUserCircle } from 'react-icons/fa';
import useProfilePicture from '../../../hooks/useProfilePicture';

/**
 * The ProfilePicture component renders the user's profile picture inside any equipped frames they
 * may have unlocked on the site.
 */
const ProfilePicture = (username: string) => {
  const { frame } = useProfilePicture(username);
  return (
    <div className='profile-container'>
      <FaUserCircle size='104px' className='profile-picture' />
      {frame && <img src={`/frames/${frame}`} alt='Profile Frame' className='profile-frame' />}
    </div>
  );
};

export default ProfilePicture;
