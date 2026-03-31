const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.favourite.deleteMany();
  await prisma.property.deleteMany();

  const result = await prisma.property.createMany({
    data: [
      {
        title: 'Heritage Newari House in Patan',
        description: 'Beautifully restored traditional Newari home with carved wooden windows and courtyard in the heart of Patan Durbar Square area.',
        price: 320000,
        location: 'Patan, Lalitpur',
        imageUrl: 'https://cdn-ilekafd.nitrocdn.com/fyIaxsUtBIUpgMNDAWTjKVGpkAjTSsQK/assets/images/optimized/rev-84c7053/www.experiencetravelgroup.com/wp-content/uploads/2025/07/DSC_0093.jpg',
      },
      {
        title: 'Mountain View Bungalow in Nagarkot',
        description: 'Stunning hilltop bungalow overlooking the Himalayan range including Everest. Ideal weekend retreat with sunrise views.',
        price: 450000,
        location: 'Nagarkot, Bhaktapur',
        imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400',
      },
      {
        title: 'Modern Flat near Thamel',
        description: 'Newly built 3BHK apartment with rooftop terrace, just minutes from the vibrant Thamel neighborhood.',
        price: 185000,
        location: 'Lazimpat, Kathmandu',
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      },
      {
        title: 'Lakeside Villa in Pokhara',
        description: 'Elegant lakeside property with Annapurna views, private garden and direct access to Phewa Lake promenade.',
        price: 520000,
        location: 'Lakeside, Pokhara',
        imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400',
      },
      {
        title: 'Riverside Cottage in Dhulikhel',
        description: 'Peaceful countryside cottage surrounded by greenery with clear river views and organic garden space.',
        price: 210000,
        location: 'Dhulikhel, Kavre',
        imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400',
      },
      {
        title: 'Penthouse in Civil Mall Area',
        description: 'Top-floor luxury penthouse with panoramic Kathmandu valley views, modular kitchen and covered parking.',
        price: 680000,
        location: 'Sundhara, Kathmandu',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
      },
    ],
  });

  console.log(`Seeded ${result.count} properties`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
