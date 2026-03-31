const prisma = require('../models/prisma');

// GET /api/favourites - returns logged-in user's favourites
const getFavourites = async (req, res) => {
  try {
    const favourites = await prisma.favourite.findMany({
      where: { userId: req.user.id },
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: favourites.length,
      data: favourites,
    });
  } catch (error) {
    console.error('Get favourites error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch favourites.' });
  }
};

// POST /api/favourites - add a property to favourites
const addFavourite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId || typeof propertyId !== 'number') {
      return res.status(400).json({ success: false, message: 'A valid propertyId (number) is required.' });
    }

    // Check property exists
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    // Check if already favourited
    const existing = await prisma.favourite.findUnique({
      where: { userId_propertyId: { userId: req.user.id, propertyId } },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Property is already in your favourites.' });
    }

    const favourite = await prisma.favourite.create({
      data: { userId: req.user.id, propertyId },
      include: { property: true },
    });

    res.status(201).json({
      success: true,
      message: 'Property added to favourites!',
      data: favourite,
    });
  } catch (error) {
    console.error('Add favourite error:', error);
    res.status(500).json({ success: false, message: 'Failed to add favourite.' });
  }
};

// DELETE /api/favourites/:propertyId - remove from favourites
const removeFavourite = async (req, res) => {
  try {
    const propertyId = parseInt(req.params.propertyId);

    if (isNaN(propertyId)) {
      return res.status(400).json({ success: false, message: 'Invalid property ID.' });
    }

    // Must belong to logged-in user
    const favourite = await prisma.favourite.findUnique({
      where: { userId_propertyId: { userId: req.user.id, propertyId } },
    });

    if (!favourite) {
      return res.status(404).json({ success: false, message: 'Favourite not found.' });
    }

    await prisma.favourite.delete({ where: { id: favourite.id } });

    res.json({ success: true, message: 'Property removed from favourites.' });
  } catch (error) {
    console.error('Remove favourite error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove favourite.' });
  }
};

module.exports = { getFavourites, addFavourite, removeFavourite };
