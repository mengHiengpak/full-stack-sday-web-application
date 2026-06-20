import 'dotenv/config';
import sequelize from './config/database';
import './models/associations';
import User from './models/User';
import Post from './models/Post';

const users = [
  { username: 'ForestWalker', email: 'forest@sbay.com', password: 'password123', bio: 'Wandering ancient woods 🌲' },
  { username: 'OceanSoul', email: 'ocean@sbay.com', password: 'password123', bio: 'Salt water runs through my veins 🌊' },
  { username: 'MountainPeak', email: 'mountain@sbay.com', password: 'password123', bio: 'Chasing summits 🏔️' },
  { username: 'WildLens', email: 'wild@sbay.com', password: 'password123', bio: 'Capturing wildlife through my lens 🦅' },
  { username: 'RiverSong', email: 'river@sbay.com', password: 'password123', bio: 'Listening to the flow of nature 🏞️' },
  { username: 'DesertBloom', email: 'desert@sbay.com', password: 'password123', bio: 'Finding beauty in the barren 🏜️' },
  { username: 'AuroraWatcher', email: 'aurora@sbay.com', password: 'password123', bio: 'Chasing the northern lights ✨' },
  { username: 'RainForest', email: 'rain@sbay.com', password: 'password123', bio: 'The jungle is my cathedral 🌴' },
  { username: 'StarGazer', email: 'star@sbay.com', password: 'password123', bio: 'Looking up at the cosmos 🔭' },
  { username: 'EarthGuardian', email: 'earth@sbay.com', password: 'password123', bio: 'Protecting our planet 🌍' },
];

const posts: { username: string; title: string; content: string; tags: string[] }[] = [
  { username: 'ForestWalker', title: 'Morning in the Ancient Woods', content: 'There is nothing quite like the quiet solitude of an old-growth forest at dawn. The mist hangs between the trees like nature\'s own veil, and the only sound is the gentle rustle of leaves overhead.', tags: ['#nature', '#forest', '#morning'] },
  { username: 'ForestWalker', title: 'The Language of Trees', content: 'Did you know trees communicate through underground fungal networks? They share nutrients and warn each other of danger. The forest is far more social than we ever imagined.', tags: ['#forest', '#nature', '#trees'] },
  { username: 'OceanSoul', title: 'Sunset at the Shore', content: 'Watching the sun dip below the horizon, painting the sky in shades of orange and pink. The waves crash rhythmically, a timeless lullaby that soothes the soul.', tags: ['#ocean', '#sunset', '#nature'] },
  { username: 'OceanSoul', title: 'Beneath the Waves', content: 'Snorkeling today revealed a world of vibrant corals and curious fish. The ocean holds more mysteries than we could explore in a lifetime.', tags: ['#ocean', '#marine', '#diving'] },
  { username: 'MountainPeak', title: 'Summit Victory', content: 'After six hours of climbing, standing on top of the world makes every sore muscle worth it. The view from above the clouds is indescribable.', tags: ['#mountains', '#hiking', '#summit'] },
  { username: 'MountainPeak', title: 'Alpine Meadows', content: 'The trail through the alpine meadow was carpeted with wildflowers in full bloom. Snow-capped peaks loomed in the distance, a breathtaking contrast.', tags: ['#mountains', '#wildflowers', '#alpine'] },
  { username: 'WildLens', title: 'The Majestic Elk', content: 'Caught this magnificent bull elk during the golden hour. His antlers were massive, and he seemed to pose just for my camera.', tags: ['#wildlife', '#elk', '#photography'] },
  { username: 'WildLens', title: 'A Fox in the Snow', content: 'This red fox was hunting in the freshly fallen snow. Its fiery coat stood out brilliantly against the white landscape.', tags: ['#wildlife', '#fox', '#snow'] },
  { username: 'RiverSong', title: 'The Sound of Running Water', content: 'Sat by the river for an hour just listening. The water sings as it dances over rocks, a melody that changes with every season.', tags: ['#river', '#nature', '#peace'] },
  { username: 'RiverSong', title: 'Kayaking Through the Gorge', content: 'Paddled through a narrow gorge today, with walls of ancient rock rising on both sides. The water was crystal clear, revealing the riverbed below.', tags: ['#river', '#kayaking', '#adventure'] },
  { username: 'DesertBloom', title: 'After the Rain', content: 'The desert comes alive after a rare rainfall. Flowers bloom in a spectacular display, proving that life finds a way even in the harshest conditions.', tags: ['#desert', '#flowers', '#resilience'] },
  { username: 'DesertBloom', title: 'Sand Dunes at Dusk', content: 'The rolling sand dunes stretched endlessly, their ripples catching the last light of day. The desert is not empty — it is full of subtle beauty.', tags: ['#desert', '#dunes', '#sunset'] },
  { username: 'AuroraWatcher', title: 'Dancing Lights', content: 'The aurora borealis put on an incredible show tonight. Curtains of green and purple light danced across the starry sky, leaving me speechless.', tags: ['#aurora', '#northernlights', '#night'] },
  { username: 'AuroraWatcher', title: 'Under the Stars', content: 'Lay on the frozen lake watching the stars wheel overhead. The Milky Way was so bright it cast shadows on the ice.', tags: ['#stars', '#night', '#aurora'] },
  { username: 'RainForest', title: 'The Canopy Walk', content: 'Walking across the suspension bridge high above the jungle floor gives you a whole new perspective. Monkeys chattered in the trees, and colorful birds flew past.', tags: ['#rainforest', '#jungle', '#canopy'] },
  { username: 'RainForest', title: 'Creatures of the Night', content: 'Night hike revealed a world of glowing fungi, sleeping birds, and tiny tree frogs. The rainforest never sleeps.', tags: ['#rainforest', '#night', '#wildlife'] },
  { username: 'StarGazer', title: 'Milky Way Rising', content: 'Captured the Milky Way arching over an old lighthouse. Light pollution is minimal here, making it one of the best stargazing spots I have ever found.', tags: ['#astronomy', '#milkyway', '#stargazing'] },
  { username: 'StarGazer', title: 'Saturn Through the Telescope', content: 'Pointed my telescope at Saturn tonight and there it was — rings and all. It never gets old seeing another world with your own eyes.', tags: ['#astronomy', '#saturn', '#telescope'] },
  { username: 'EarthGuardian', title: 'Restoring the Mangroves', content: 'Volunteered with a local group to plant mangrove saplings along the coast. These trees are vital for coastal protection and biodiversity.', tags: ['#conservation', '#mangroves', '#volunteer'] },
  { username: 'EarthGuardian', title: 'Plastic-Free Challenge', content: 'Completed 30 days plastic-free! It is challenging but eye-opening. Small changes in our daily habits can make a big difference for the planet.', tags: ['#sustainability', '#plasticfree', '#environment'] },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync();
    console.log('✅ Models synced');

    const createdUsers = await User.bulkCreate(users, { individualHooks: true });
    console.log(`✅ Created ${createdUsers.length} users`);

    const userMap = new Map(createdUsers.map(u => [u.username, u.id]));

    let postCount = 0;
    for (const post of posts) {
      const userId = userMap.get(post.username);
      if (!userId) {
        console.warn(`⚠️  User ${post.username} not found, skipping post`);
        continue;
      }
      await Post.create({
        authorId: userId,
        title: post.title,
        content: post.content,
        visibility: 'public',
        tags: post.tags,
      });
      postCount++;
    }
    console.log(`✅ Created ${postCount} posts`);

    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
