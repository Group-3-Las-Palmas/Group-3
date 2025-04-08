import { useEffect, useState } from 'react';
import { getUserRewards } from '../../services/rewardServices';

const UserRewards = ({ userId }) => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const data = await getUserRewards(userId);
        setRewards(data);
      } catch (err) {
        console.error('Error fetching rewards:', err);
      }
    };

    fetchRewards();
  }, [userId]);

  return (
    <div className="rewards">
      <div className="flex flex-wrap gap-4">
        {rewards.map(reward => (
          <div key={reward.reward_id} className="text-center">
            {reward.badge && (
              <img
                src={`data:image/png;base64,${reward.badge}`} // b64 image
                alt={reward.name}
                className="w-24 h-24 object-contain rounded-lg shadow"
              />
            )}
            <p className="mt-2">{reward.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRewards;
