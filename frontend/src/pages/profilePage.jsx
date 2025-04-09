import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserRewards from '../components/reward/userRewards';
import FavouriteExercises from '../components/activity/favourites';
import { getUserById } from '../services/userServices';
import { SERVER_BASE_URL } from '../services/apiServices';
import {
  ProfileContainer,
  UserInfo,
  Avatar,
  UserName,
  SectionTitle,
  Separator,
  Section
} from '../styles/profilePageStyled';

const DEFAULT_AVATAR_SRC = `${SERVER_BASE_URL}/uploads/without_image.webp`;

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedUserString = localStorage.getItem('user');
        if (!storedUserString) {
          throw new Error("User not logged in. Please log in again.");
        }

        const storedUser = JSON.parse(storedUserString);
        const currentUserId = storedUser?.user_id;

        if (!currentUserId) {
          throw new Error("User ID not found in stored data. Please log in again.");
        }

        const userData = await getUserById(currentUserId);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load profile data.');
        if (err.message.includes('401') || err.message.includes('403') || err.message.includes('log in')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div className="text-center p-4">Loading profile...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  if (!user) return <div className="text-center p-4">User data could not be loaded.</div>;

  const avatarSrc = user.profile_image_url
    ? `${SERVER_BASE_URL}${user.profile_image_url.startsWith('/') ? '' : '/'}${user.profile_image_url}`
    : DEFAULT_AVATAR_SRC;

  return (
    <ProfileContainer>
      <UserInfo>
        <div style={{ position: 'relative' }}>
          <Avatar
            src={avatarSrc}
            alt={`${user.username}'s avatar`}
            onError={(e) => {
              console.warn(`Failed to load image: ${avatarSrc}. Falling back to default.`);
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR_SRC;
            }}
          />
          <button
            onClick={() => navigate('/settingsUserPage')}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              padding: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Go to settings"
            title="Go to settings"
          >
            <span role="img" aria-label="settings" style={{ fontSize: '1.5rem' }}>⚙️</span>
          </button>
        </div>
        <UserName>{user.username}</UserName>
      </UserInfo>

      <Section>
        <SectionTitle>Your badges!</SectionTitle>
        <UserRewards userId={user.user_id} />
      </Section>

      <Separator />

      <Section>
        <SectionTitle>Favourite activities</SectionTitle>
        <FavouriteExercises userId={user.user_id} />
      </Section>

      <div style={{ paddingBottom: '60px' }}></div>
    </ProfileContainer>
  );
};

export default UserProfilePage;
