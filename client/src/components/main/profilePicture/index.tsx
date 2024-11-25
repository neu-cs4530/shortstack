import { FaUserCircle } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import './index.css';

/**
 * The ProfilePicture component renders the user's profile picture inside any equipped frames they
 * may have unlocked on the site.
 *
 * @param username - the username of the user whose profile picture & frame we are displaying
 */
const ProfilePicture = ({ equippedFrame }: { equippedFrame: string }) => (
  <div className='profile-container'>
    <IconContext.Provider value={{ size: 'auto' }}>
      <FaUserCircle className='profile-picture' />
    </IconContext.Provider>
    {equippedFrame && (
      <img src={`/frames/${equippedFrame}`} alt='Profile Frame' className='profile-frame' />
    )}
  </div>
);

export default ProfilePicture;
