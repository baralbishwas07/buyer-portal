const prisma = require('../models/prisma');

const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties.',
    });
  }
};

module.exports = { getAllProperties };
