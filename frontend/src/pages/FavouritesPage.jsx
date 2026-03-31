import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { fetchFavourites, removeFavourite } from '../services/api';

function FavouritesPage() {
  const [favourites, setFavourites] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadFavourites();
  }, []);

  async function loadFavourites() {
    const result = await fetchFavourites();
    if (result.success) {
      setFavourites(result.data);
    }
    setInitialLoading(false);
  }

  async function handleRemove(propertyId) {
    const previousFavourites = favourites;
    setFavourites((prev) => prev.filter((fav) => fav.propertyId !== propertyId));

    const result = await removeFavourite(propertyId);
    if (result.success) {
      toast.success('Removed from favourites');
    } else {
      setFavourites(previousFavourites);
      toast.error(result.message || 'Failed to remove');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section>
          <h2 className="text-2xl font-bold text-navy mb-1 tracking-tight">My Favourites</h2>
          <p className="text-gray-400 text-sm mb-6">Your saved properties.</p>

          {initialLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-8 w-8 border-3 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : favourites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((fav) => (
                <PropertyCard
                  key={fav.id}
                  property={fav.property}
                  isFavourited={true}
                  onRemove={() => handleRemove(fav.propertyId)}
                  showRemoveOnly
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-white">
              <p className="text-gray-400">No favourites yet. Browse properties on the dashboard.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default FavouritesPage;
