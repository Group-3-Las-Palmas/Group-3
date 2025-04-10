// Group-3/frontend/src/components/reward/userRewards.jsx
import React, { useEffect, useState } from 'react';
import { getUserRewards } from '../../services/rewardServices';
import { SERVER_BASE_URL } from '../../services/apiServices';
// --- Importar los nuevos styled-components ---
import {
  RewardsContainer,
  RewardItem,
  BadgeImage,
  RewardName
} from '../../styles/userRewardsStyled.js';
// ------------------------------------------

// Ruta a un placeholder local (ajústala)
const DEFAULT_BADGE_PLACEHOLDER = '/img/placeholder-badge.png';

const UserRewards = ({ userId }) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!userId) {
         setLoading(false);
         return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getUserRewards(userId);
        console.log("API Response for Rewards:", data);
        setRewards(data || []);
      } catch (err) {
        console.error('Error fetching rewards:', err);
        setError('Could not load rewards.');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [userId]);

  if (loading) return <p>Loading rewards...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (rewards.length === 0) return <p>No badges earned yet. Keep completing activities!</p>;

  return (
    // --- Usar el contenedor principal de styled-components ---
    <RewardsContainer>
      {rewards.map(reward => {
        let badgeSrc = DEFAULT_BADGE_PLACEHOLDER;
        if (reward.badge && typeof reward.badge === 'string') {
           const relativePath = reward.badge.startsWith('/') ? reward.badge : `/${reward.badge}`;
           badgeSrc = `${SERVER_BASE_URL}${relativePath}`;
        }

        console.log(`Reward: "${reward.name}", Final badgeSrc for img: ${badgeSrc}`);

        return (
          // --- Usar el contenedor de item ---
          <RewardItem key={reward.reward_id}>
            {/* --- Usar el componente de imagen --- */}
            <BadgeImage
              src={badgeSrc}
              alt={reward.name}
              // El onError se mantiene igual
              onError={(e) => {
                console.warn(`Failed to load badge image from src: ${badgeSrc}. Using placeholder.`);
                e.target.onerror = null;
                e.target.src = DEFAULT_BADGE_PLACEHOLDER;
              }}
            />
            {/* --- Usar el componente de nombre --- */}
            <RewardName>{reward.name}</RewardName>
          </RewardItem>
        );
      })}
    </RewardsContainer>
    // --------------------------------------------------
  );
};

export default UserRewards;