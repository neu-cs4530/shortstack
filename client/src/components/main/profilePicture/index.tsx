import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import useProfilePicture from '../../../hooks/useProfilePicture';
import './index.css';

/**
 * The ProfilePicture component renders the user's profile picture inside any equipped frames they
 * may have unlocked on the site.
 */
const ProfilePicture = ({ username }: { username: string }) => {
  const { frame } = useProfilePicture(username);
  return (
    <div className='profile-container'>
      <IconContext.Provider value={{ size: 'auto' }}>
        <FaUserCircle className='profile-picture' />
      </IconContext.Provider>
      {frame && <img src={`/frames/${frame}`} alt='Profile Frame' className='profile-frame' />}
    </div>
  );
};

export default ProfilePicture;
