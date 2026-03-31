function PropertyCard({ property, isFavourited, onAdd, onRemove, showRemoveOnly }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="overflow-hidden">
        <img
          src={property.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 text-base mb-1">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{property.location}</p>
        <p className="text-accent font-bold text-lg mb-2">${property.price?.toLocaleString()}</p>
        {property.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{property.description}</p>
        )}

        {showRemoveOnly ? (
          <button
            onClick={onRemove}
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 border border-red-200 cursor-pointer hover:bg-red-100 transition-all duration-200"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={isFavourited ? onRemove : onAdd}
            className={`w-full py-2.5 text-sm font-medium rounded-lg border cursor-pointer transition-all duration-200 ${
              isFavourited
                ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                : 'bg-accent/5 text-accent border-accent/20 hover:bg-accent/10 hover:border-accent/40'
            }`}
          >
            {isFavourited ? 'Favourited' : 'Add to Favourites'}
          </button>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;
