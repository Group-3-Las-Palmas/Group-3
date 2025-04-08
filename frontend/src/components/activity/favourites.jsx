import { getFavouriteExercisesByUser } from '../services/userExerciseService';

const FavouriteExercises = ({ userId }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const data = await getFavouriteExercisesByUser(userId);
        setFavourites(data);
      } catch (err) {
        console.error("Error fetching favourites", err);
      }
    };

    fetchFavourites();
  }, [userId]);

  return (
    <div className="favourites">
      <h2>Favourite Exercises</h2>
      <ul>
        {favourites.map((item) => (
          <li key={item.exercise_id}>
            <strong>{item.Exercise.title}</strong> - {item.Exercise.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavouriteExercises;
