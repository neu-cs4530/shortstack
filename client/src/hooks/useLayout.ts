import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';

/**
 * Custom hook for managing the points indicator's state and real-time point updates.
 *
 * @returns points - the number of points a user has earned from completing an action.
 */
const useLayout = () => {
  const [points, setPoints] = useState<number>(0);
  const { user, socket } = useUserContext();

  const showIndicator = () => {
    (document.querySelector('.points-indicator') as HTMLElement).style.display = 'block';

    setTimeout(() => {
      (document.querySelector('.points-indicator') as HTMLElement).style.display = 'none';
    }, 2000);
  };

  useEffect(() => {
    const handlePointsUpdate = async ({
      username,
      pointsAdded,
    }: {
      username: string;
      pointsAdded: number;
      totalPoints: number;
    }) => {
      if (username === user.username) {
        setPoints(pointsAdded);
        showIndicator();
      }
    };

    socket.on('pointsUpdate', handlePointsUpdate);

    return () => {
      if (socket) {
        socket.off('pointsUpdate', handlePointsUpdate);
      }
    };
  }, [socket]);

  return { points };
};

export default useLayout;
