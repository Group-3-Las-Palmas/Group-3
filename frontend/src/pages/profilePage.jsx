import { useEffect, useState } from 'react';
import UserRewards from '../components/reward/userRewards';
import FavouriteExercises from '../components/activity/favourites';
import axios from 'axios';

const UserProfilePage = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get info from user
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-yellow-50 to-yellow-200 px-4 pt-6 pb-20">
      {/* Profile pic and username*/}
      <div className="flex flex-col items-center text-center">
        <img
          src={user.profilePictureUrl}
          alt="User avatar"
          className="w-24 h-24 rounded-full object-cover shadow-md mb-2"
        />
        <h2 className="text-xl font-semibold">{user.username}</h2>
        {/* Settings icon */}
        <button className="absolute top-4 right-4 text-gray-500">
          <span role="img" aria-label="settings">⚙️</span>
        </button>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h3 className="text-center text-lg font-bold mb-2">Your badges!</h3>
        <UserRewards userId={userId} />
      </div>

      {/* Split line */}
      <hr className="my-6 border-green-300" />

      {/* Favourite exercises */}
      <div>
        <h3 className="text-lg font-bold mb-4">Favourite activities</h3>
        <FavouriteExercises userId={userId} />
      </div>

    </div>
  );
};

export default UserProfilePage;
