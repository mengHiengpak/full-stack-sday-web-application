const firstNames = [
  'Sophia', 'Ethan', 'Luna', 'Oliver', 'Aria', 'Noah', 'Mia', 'Liam', 'Zara', 'Lucas',
  'Emma', 'James', 'Ava', 'Benjamin', 'Isabella', 'Mason', 'Charlotte', 'Elijah', 'Amelia', 'William',
  'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Daniel', 'Emily', 'Matthew', 'Elizabeth', 'Jackson',
  'Sofia', 'David', 'Ella', 'Joseph', 'Avery', 'Samuel', 'Scarlett', 'Sebastian', 'Grace', 'Andrew',
  'Chloe', 'Jack', 'Victoria', 'Owen', 'Riley', 'Dylan', 'Aria', 'Luke', 'Penelope', 'Ryan',
  'Layla', 'Nathan', 'Lily', 'Caleb', 'Stella', 'Christian', 'Hannah', 'Isaac', 'Aurora', 'Gabriel',
  'Nora', 'Anthony', 'Leah', 'Lincoln', 'Savannah', 'Joshua', 'Audrey', 'Aaron', 'Claire', 'Josiah',
  'Eleanor', 'Hunter', 'Ruby', 'Eli', 'Hazel', 'Adrian', 'Violet', 'Connor', 'Naomi', 'Ezra',
  'Paisley', 'Leo', 'Anna', 'Carson', 'Kaylee', 'Thomas', 'Sarah', 'Charles', 'Delilah', 'Christopher',
  'Aaliyah', 'Jaxon', 'Madelyn', 'Maverick', 'Valentina', 'Dominic', 'Bella', 'Roman', 'Ariana', 'Axel',
];

const lastNames = [
  'Forest', 'Rivers', 'Meadow', 'Stone', 'Sky', 'Ocean', 'Woods', 'Lake', 'Field', 'Hill',
  'Storm', 'Rain', 'Snow', 'Wind', 'Star', 'Moon', 'Sun', 'Cloud', 'Brook', 'Leaf',
  'Pine', 'Oak', 'Willow', 'Cedar', 'Birch', 'Ash', 'Fern', 'Moss', 'Flower', 'Thorn',
  'Crystal', 'Shadow', 'Light', 'Frost', 'Flame', 'Thunder', 'Wave', 'Tide', 'Dawn', 'Dusk',
  'Valley', 'Peak', 'Ridge', 'Cliff', 'Cave', 'Falls', 'Rivera', 'Monte', 'Marino', 'Castle',
  'Knight', 'Phoenix', 'Dragon', 'Wolf', 'Bear', 'Falcon', 'Raven', 'Swift', 'Bird', 'Fox',
  'Hart', 'Lyon', 'Price', 'King', 'Ward', 'Gray', 'Cole', 'West', 'Grove', 'Blake',
  'Wells', 'Reed', 'Hayes', 'Hart', 'Cross', 'Bridges', 'Stone', 'Ford', 'Grant', 'Hunter',
  'Fisher', 'Carter', 'Chase', 'Pierce', 'Kane', 'Vance', 'Quinn', 'Reese', 'Blair', 'Dale',
  'Wade', 'Nash', 'Hartley', 'Oakley', 'Bentley', 'Marley', 'Bradley', 'Riley', 'Finley', 'Harley',
];

const categories = ['Tech', 'Travel', 'Food', 'Nature', 'Art', 'Music', 'Sports', 'Fashion', 'Photography', 'Lifestyle', 'Fitness', 'Education'];
const tagPool = ['nature', 'photography', 'travel', 'sunset', 'adventure', 'wildlife', 'fitness', 'foodie', 'art', 'music', 'fashion', 'tech', 'love', 'peace', 'happy', 'vibes', 'explore', 'wanderlust', 'beautiful', 'inspired'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN(arr, n, rng) {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

const avatarUrl = (id) => `https://i.pravatar.cc/150?u=sbay_user_${id}`;
const imgUrl = (seed, w = 600, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const storyImgUrl = (seed) => `https://picsum.photos/seed/story_${seed}/400/700`;

export function generateMockUsers() {
  const users = [];
  for (let i = 1; i <= 100; i++) {
    const rng = seededRandom(i * 7 + 13);
    const first = pick(firstNames, rng);
    const last = pick(lastNames, rng);
    const username = `${first.toLowerCase()}.${last.toLowerCase()}`;
    const bio = pick([
      `Exploring the world one photo at a time 🌍`,
      `Love nature & photography 📸`,
      `Living life in full color ✨`,
      `Dreamer | Creator | Explorer 🚀`,
      `Fitness | Travel | Good Vibes 🌟`,
      `Making memories every day 💫`,
      `Chasing sunsets and adventures 🌅`,
      `Just a soul with a camera 📷`,
      `Born to wander ✈️`,
      `Creating my own sunshine ☀️`,
    ], rng);
    users.push({
      id: `mock_user_${i}`,
      username,
      email: `${username}@email.com`,
      profilePicture: avatarUrl(i),
      bio,
      friendStatus: i <= 20 ? (i <= 10 ? 'friends' : 'sent') : 'none',
      createdAt: new Date(Date.now() - Math.floor(rng() * 365 * 86400000)).toISOString(),
    });
  }
  return users;
}

export function generateMockPosts(users) {
  const posts = [];
  const rngGlobal = seededRandom(42);

  for (let i = 1; i <= 100; i++) {
    const rng = seededRandom(i * 31 + 17);
    const author = users[Math.floor(rng() * users.length)];
    const hasMedia = rng() > 0.15;
    const hasImage = hasMedia && rng() > 0.2;
    const seed = `post_img_${i}`;
    const imgW = 600 + Math.floor(rng() * 100);
    const imgH = 400 + Math.floor(rng() * 100);
    const tagCount = 1 + Math.floor(rng() * 4);
    const likeCount = Math.floor(rng() * 150);
    const commentCount = Math.floor(rng() * 30);

    const contentOptions = [
      `Just enjoyed the most incredible sunset! The colors were absolutely breathtaking tonight. 🌅✨`,
      `New adventures await! Can't wait to explore more of this beautiful world. 🌍`,
      ` Found this amazing spot today. Peaceful and full of natural beauty. 🍃`,
      `Golden hour never disappoints. Every moment is a gift. 📸✨`,
      `Weekend vibes with the best company. Life is good! 🎉`,
      `Tried something new today and loved it! Growth happens outside comfort zones. 💪`,
      `This place feels like a dream. So grateful for moments like these. 🌟`,
      `Nature's beauty never fails to amaze me. Just look at those colors! 🎨`,
      `Adventure awaits around every corner. Keep exploring! 🗺️`,
      `Simple moments, lasting memories. ❤️`,
      `Living my best life, one day at a time. ✨`,
      `When you find a place that feels like home. 🏡`,
      `Chasing waterfalls and good vibes! 💦`,
      `The best view comes after the hardest climb. 🏔️`,
      `Every sunset brings the promise of a new dawn. 🌅`,
      `Good food, good vibes, great company. What more could I ask for? 🍽️`,
      `Lost in the right direction. 🧭`,
      `Making memories that will last a lifetime. 📸`,
      `Sometimes the best therapy is nature. 🌿`,
      `Just another day in paradise! 🏝️`,
    ];

    posts.push({
      id: `mock_post_${i}`,
      title: rng() > 0.4 ? pick([
        'A Beautiful Day', 'Nature at its Best', 'Weekend Adventures',
        'Golden Hour Magic', 'Exploring New Places', 'Peaceful Moments',
        'Summer Vibes', 'Throwback Thursday', 'Morning Glory', 'Sunset Chasers',
      ], rng) : '',
      content: pick(contentOptions, rng),
      mediaUrl: hasMedia ? (hasImage ? imgUrl(seed, imgW, imgH) : `https://www.w3schools.com/html/mov_bbb.mp4`) : null,
      mediaType: hasMedia ? (hasImage ? 'image' : 'video') : null,
      tags: pickN(tagPool, tagCount, rng),
      author: author,
      likeCount: likeCount,
      commentCount: commentCount,
      likedByUser: rng() > 0.6,
      createdAt: new Date(Date.now() - Math.floor(rng() * 30 * 86400000)).toISOString(),
      visibility: 'public',
    });
  }
  return posts;
}

export function generateMockStories(users) {
  const stories = [];
  const numStories = 20;

  for (let i = 0; i < numStories; i++) {
    const rng = seededRandom(i * 53 + 11);
    const author = users[Math.floor(rng() * users.length)];
    const seed = `story_${i}`;

    stories.push({
      id: `mock_story_${i}`,
      mediaUrl: storyImgUrl(seed),
      mediaType: 'image',
      caption: pick(['Good vibes only ✨', 'Living my best life 🌟', 'Beautiful day 🌅', 'Adventure awaits 🗺️', 'Peace & love ❤️', 'New beginnings 🌱', 'Grateful 🙏', 'On top of the world 🏔️'], rng),
      author: {
        id: author.id,
        username: author.username,
        profilePicture: author.profilePicture,
      },
      createdAt: new Date(Date.now() - Math.floor(rng() * 12 * 3600000)).toISOString(),
    });
  }
  return stories;
}

export function generateMockReels(users) {
  return [
    {
      id: 'mock_reel_1', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[0],
      title: 'Beautiful Morning Routine', content: 'Starting the day right! 🌅',
      likeCount: 234, commentCount: 18, likedByUser: false, song: 'Morning Vibes',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'mock_reel_2', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[5],
      title: 'Dance Challenge', content: 'Trying out this new dance trend! 💃',
      likeCount: 567, commentCount: 42, likedByUser: false, song: 'Popular Song 2024',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'mock_reel_3', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[12],
      title: 'Cooking Tutorial', content: 'Making my favorite pasta dish! 🍝',
      likeCount: 891, commentCount: 67, likedByUser: false, song: 'Cooking Beats',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'mock_reel_4', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[3],
      title: 'Workout Routine', content: 'No pain no gain! 💪',
      likeCount: 345, commentCount: 23, likedByUser: false, song: 'Workout Mix',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'mock_reel_5', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[8],
      title: 'Travel Vlog', content: 'Exploring hidden gems in the city 🏙️',
      likeCount: 678, commentCount: 51, likedByUser: false, song: 'Travel Vibes',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'mock_reel_6', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[15],
      title: 'Pet Fun', content: 'My dog being adorable as always 🐕',
      likeCount: 1234, commentCount: 89, likedByUser: false, song: 'Cute Animals',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'mock_reel_7', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[7],
      title: 'Art Time Lapse', content: 'Watch this painting come to life! 🎨',
      likeCount: 456, commentCount: 34, likedByUser: false, song: 'Creative Flow',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'mock_reel_8', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[20],
      title: 'Nature Walk', content: 'Peaceful walk through the woods 🌲',
      likeCount: 789, commentCount: 56, likedByUser: false, song: 'Nature Sounds',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'mock_reel_9', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[2],
      title: 'Sunset Timelapse', content: 'Capturing the perfect sunset 🌅',
      likeCount: 901, commentCount: 73, likedByUser: false, song: 'Chill Sunset',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'mock_reel_10', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', author: users[18],
      title: 'Fashion Haul', content: 'New outfit for the summer! 👗',
      likeCount: 345, commentCount: 28, likedByUser: false, song: 'Fashion Beat',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
  ];
}

let mockUsersCache = null;
let mockPostsCache = null;
let mockStoriesCache = null;
let mockReelsCache = null;

export function getMockUsers() {
  if (!mockUsersCache) mockUsersCache = generateMockUsers();
  return mockUsersCache;
}

export function getMockPosts() {
  if (!mockPostsCache) mockPostsCache = generateMockPosts(getMockUsers());
  return mockPostsCache;
}

export function getMockStories() {
  if (!mockStoriesCache) mockStoriesCache = generateMockStories(getMockUsers());
  return mockStoriesCache;
}

export function getMockReels() {
  if (!mockReelsCache) mockReelsCache = generateMockReels(getMockUsers());
  return mockReelsCache;
}

export function getPaginatedPosts(page = 1, limit = 10) {
  const all = getMockPosts();
  const start = (page - 1) * limit;
  return {
    data: all.slice(start, start + limit),
    total: all.length,
    page,
    totalPages: Math.ceil(all.length / limit),
  };
}

export function getCurrentUser() {
  const users = getMockUsers();
  return {
    ...users[0],
    email: 'demo@sbay.com',
    password: 'demo123',
    id: users[0].id,
  };
}