import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, fetchFavourites, addFavourite, removeFavourite } from '../services/api';

function DashboardPage() {
  const [properties, setProperties] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [propResult, favResult] = await Promise.all([fetchProperties(), fetchFavourites()]);

    if (propResult.success) setProperties(propResult.data);
    if (favResult.success) {
      setFavouriteIds(new Set(favResult.data.map((f) => f.propertyId)));
    }
    setInitialLoading(false);
  }

  async function handleAdd(propertyId) {
    // Optimistic UI + Toast
    setFavouriteIds((prev) => new Set([...prev, propertyId]));
    toast.success('Added to favourites');

    const result = await addFavourite(propertyId);
    if (!result.success) {
      // Revert on failure
      setFavouriteIds((prev) => {
        const updated = new Set(prev);
        updated.delete(propertyId);
        return updated;
      });
      toast.dismiss(); // Remove the success toast
      toast.error(result.message || 'Failed to add');
    }
  }

  async function handleRemove(propertyId) {
    // Optimistic UI + Toast
    setFavouriteIds((prev) => {
      const updated = new Set(prev);
      updated.delete(propertyId);
      return updated;
    });
    toast.success('Removed from favourites');

    const result = await removeFavourite(propertyId);
    if (!result.success) {
      // Revert on failure
      setFavouriteIds((prev) => new Set([...prev, propertyId]));
      toast.dismiss();
      toast.error(result.message || 'Failed to remove');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <section>
          <h2 className="text-2xl font-bold text-navy mb-1 tracking-tight">Available Properties</h2>
          <p className="text-gray-400 text-sm mb-6">Browse listings and add to your favourites.</p>

          {initialLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-8 w-8 border-3 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isFavourited={favouriteIds.has(p.id)}
                  onAdd={() => handleAdd(p.id)}
                  onRemove={() => handleRemove(p.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-16">No properties available.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
