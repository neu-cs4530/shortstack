import { FaMedal } from 'react-icons/fa';
import './index.css';

/**
 * Interface representing the props for the PointsIndicator component
 *
 * - points: The number of points a user has earned from completing an action.
 */
interface PointsIndicatorProps {
  points: number;
}

/**
 * PointsIndicator component that displays the amount of points a user has earned when they perform
 * an action that rewards them points.
 * @param points - the number of points a user has earned
 */
const PointsIndicator = ({ points }: PointsIndicatorProps) => (
  <div className='indicator-container'>
    <FaMedal className='medal-icon' size={24} />
    <h5>+{points} points earned!</h5>
  </div>
);

export default PointsIndicator;
