const savedCollections = {
  'nature-wallpapers': {
    name: 'Nature Wallpapers',
    icon: 'fa-image',
    color: '#4ade80',
    description: 'Beautiful nature wallpapers and photos',
    items: [
      { id: 'nw1', title: 'Mountain Sunrise', image: 'https://picsum.photos/seed/nature1/600/400', type: 'image', desc: 'Golden sunrise over misty mountains' },
      { id: 'nw2', title: 'Forest Path', image: 'https://picsum.photos/seed/nature2/600/400', type: 'image', desc: 'A winding path through an ancient forest' },
      { id: 'nw3', title: 'Ocean Waves', image: 'https://picsum.photos/seed/nature3/600/400', type: 'image', desc: 'Crashing waves at sunset' },
      { id: 'nw4', title: 'Starry Night', image: 'https://picsum.photos/seed/nature4/600/400', type: 'image', desc: 'Milky way over a silent valley' },
      { id: 'nw5', title: 'Autumn Leaves', image: 'https://picsum.photos/seed/nature5/600/400', type: 'image', desc: 'Colorful autumn foliage' },
      { id: 'nw6', title: 'Waterfall', image: 'https://picsum.photos/seed/nature6/600/400', type: 'image', desc: 'Cascading waterfall in tropical forest' },
      { id: 'nw7', title: 'Lake Reflection', image: 'https://picsum.photos/seed/nature7/600/400', type: 'image', desc: 'Perfect mirror reflection on a calm lake' },
      { id: 'nw8', title: 'Wildflower Meadow', image: 'https://picsum.photos/seed/nature8/600/400', type: 'image', desc: 'Field of wildflowers in spring' },
      { id: 'nw9', title: 'Desert Dunes', image: 'https://picsum.photos/seed/nature9/600/400', type: 'image', desc: 'Golden sand dunes at dusk' },
      { id: 'nw10', title: 'Snowy Peaks', image: 'https://picsum.photos/seed/nature10/600/400', type: 'image', desc: 'Snow-capped mountain peaks' },
      { id: 'nw11', title: 'Tropical Beach', image: 'https://picsum.photos/seed/nature11/600/400', type: 'image', desc: 'Pristine tropical beach with palm trees' },
      { id: 'nw12', title: 'Rainbow Sky', image: 'https://picsum.photos/seed/nature12/600/400', type: 'image', desc: 'Double rainbow after a storm' },
    ],
  },
  'trails-to-explore': {
    name: 'Trails to Explore',
    icon: 'fa-map',
    color: '#f97316',
    description: 'Amazing hiking trails and routes',
    items: [
      { id: 'tr1', title: 'Angkor Wat Trail', image: 'https://picsum.photos/seed/trail1/600/400', type: 'image', desc: 'Ancient temple trail through the jungle' },
      { id: 'tr2', title: 'Bokor Mountain', image: 'https://picsum.photos/seed/trail2/600/400', type: 'image', desc: 'Challenging hike up Bokor Mountain' },
      { id: 'tr3', title: 'Kulen Waterfall', image: 'https://picsum.photos/seed/trail3/600/400', type: 'image', desc: 'Trail leading to breathtaking waterfalls' },
      { id: 'tr4', title: 'Cardamom Trek', image: 'https://picsum.photos/seed/trail4/600/400', type: 'image', desc: 'Multi-day trek through Cardamom Mountains' },
      { id: 'tr5', title: 'Coastal Path', image: 'https://picsum.photos/seed/trail5/600/400', type: 'image', desc: 'Scenic coastal walking trail' },
      { id: 'tr6', title: 'Forest Canopy', image: 'https://picsum.photos/seed/trail6/600/400', type: 'image', desc: 'Canopy walk through the rainforest' },
      { id: 'tr7', title: 'River Valley', image: 'https://picsum.photos/seed/trail7/600/400', type: 'image', desc: 'Peaceful trail along the river valley' },
      { id: 'tr8', title: 'Sunrise Ridge', image: 'https://picsum.photos/seed/trail8/600/400', type: 'image', desc: 'Early morning ridge hike for sunrise' },
    ],
  },
  'camping-gear': {
    name: 'Camping Gear',
    icon: 'fa-campground',
    color: '#22c55e',
    description: 'Essential camping equipment and gear',
    items: [
      { id: 'cg1', title: '4-Season Tent', image: 'https://picsum.photos/seed/gear1/600/400', type: 'image', desc: 'Durable 4-season camping tent' },
      { id: 'cg2', title: 'Sleeping Bag', image: 'https://picsum.photos/seed/gear2/600/400', type: 'image', desc: 'Warm sleeping bag rated to -10°C' },
      { id: 'cg3', title: 'Camp Stove', image: 'https://picsum.photos/seed/gear3/600/400', type: 'image', desc: 'Portable camping stove with fuel' },
      { id: 'cg4', title: 'Headlamp', image: 'https://picsum.photos/seed/gear4/600/400', type: 'image', desc: 'Bright LED headlamp with long battery' },
      { id: 'cg5', title: 'Water Filter', image: 'https://picsum.photos/seed/gear5/600/400', type: 'image', desc: 'Portable water filtration system' },
    ],
  },
  'plant-care-tips': {
    name: 'Plant Care Tips',
    icon: 'fa-seedling',
    color: '#34d399',
    description: 'Tips and guides for plant care',
    items: [
      { id: 'pc1', title: 'Watering Guide', image: 'https://picsum.photos/seed/plant1/600/400', type: 'image', desc: 'Complete guide to watering your plants' },
      { id: 'pc2', title: 'Soil Mix', image: 'https://picsum.photos/seed/plant2/600/400', type: 'image', desc: 'Best soil mix for indoor plants' },
      { id: 'pc3', title: 'Pruning Tips', image: 'https://picsum.photos/seed/plant3/600/400', type: 'image', desc: 'How to prune your plants properly' },
      { id: 'pc4', title: 'Light Requirements', image: 'https://picsum.photos/seed/plant4/600/400', type: 'image', desc: 'Understanding plant light needs' },
      { id: 'pc5', title: 'Fertilizer Guide', image: 'https://picsum.photos/seed/plant5/600/400', type: 'image', desc: 'Natural and chemical fertilizer options' },
      { id: 'pc6', title: 'Pest Control', image: 'https://picsum.photos/seed/plant6/600/400', type: 'image', desc: 'Natural pest control methods' },
      { id: 'pc7', title: 'Propagation', image: 'https://picsum.photos/seed/plant7/600/400', type: 'image', desc: 'How to propagate your plants' },
      { id: 'pc8', title: 'Indoor Garden', image: 'https://picsum.photos/seed/plant8/600/400', type: 'image', desc: 'Setting up an indoor garden' },
      { id: 'pc9', title: 'Seasonal Care', image: 'https://picsum.photos/seed/plant9/600/400', type: 'image', desc: 'Plant care through the seasons' },
      { id: 'pc10', title: 'Plant Diseases', image: 'https://picsum.photos/seed/plant10/600/400', type: 'image', desc: 'Identifying and treating plant diseases' },
      { id: 'pc11', title: 'Container Garden', image: 'https://picsum.photos/seed/plant11/600/400', type: 'image', desc: 'Container gardening for small spaces' },
      { id: 'pc12', title: 'Herb Garden', image: 'https://picsum.photos/seed/plant12/600/400', type: 'image', desc: 'Growing herbs at home' },
      { id: 'pc13', title: 'Succulent Care', image: 'https://picsum.photos/seed/plant13/600/400', type: 'image', desc: 'Complete succulent care guide' },
      { id: 'pc14', title: 'Air Purifying Plants', image: 'https://picsum.photos/seed/plant14/600/400', type: 'image', desc: 'Best plants for clean air' },
    ],
  },
  'wildlife-guides': {
    name: 'Wildlife Guides',
    icon: 'fa-paw',
    color: '#f59e0b',
    description: 'Guides to wildlife species and conservation',
    items: [
      { id: 'wg1', title: 'Bird Watching', image: 'https://picsum.photos/seed/wild1/600/400', type: 'image', desc: 'Guide to bird watching in Cambodia' },
      { id: 'wg2', title: 'Butterfly Species', image: 'https://picsum.photos/seed/wild2/600/400', type: 'image', desc: 'Beautiful butterfly species to spot' },
      { id: 'wg3', title: 'Mammal Tracking', image: 'https://picsum.photos/seed/wild3/600/400', type: 'image', desc: 'How to track wild mammals' },
      { id: 'wg4', title: 'Reptile Guide', image: 'https://picsum.photos/seed/wild4/600/400', type: 'image', desc: 'Snakes, lizards and other reptiles' },
      { id: 'wg5', title: 'Marine Life', image: 'https://picsum.photos/seed/wild5/600/400', type: 'image', desc: 'Coastal and marine wildlife guide' },
      { id: 'wg6', title: 'Endangered Species', image: 'https://picsum.photos/seed/wild6/600/400', type: 'image', desc: 'Protecting endangered wildlife' },
      { id: 'wg7', title: 'Night Safari', image: 'https://picsum.photos/seed/wild7/600/400', type: 'image', desc: 'Nocturnal wildlife spotting guide' },
    ],
  },
  'ocean-facts': {
    name: 'Ocean Facts',
    icon: 'fa-fish',
    color: '#0ea5e9',
    description: 'Fascinating facts about our oceans',
    items: [
      { id: 'oc1', title: 'Coral Reefs', image: 'https://picsum.photos/seed/ocean1/600/400', type: 'image', desc: 'The rainforests of the sea' },
      { id: 'oc2', title: 'Deep Sea', image: 'https://picsum.photos/seed/ocean2/600/400', type: 'image', desc: 'Mysteries of the deep ocean' },
      { id: 'oc3', title: 'Whale Migration', image: 'https://picsum.photos/seed/ocean3/600/400', type: 'image', desc: 'Incredible whale migration patterns' },
      { id: 'oc4', title: 'Ocean Currents', image: 'https://picsum.photos/seed/ocean4/600/400', type: 'image', desc: 'How ocean currents shape our climate' },
      { id: 'oc5', title: 'Sea Turtles', image: 'https://picsum.photos/seed/ocean5/600/400', type: 'image', desc: 'Sea turtle species and conservation' },
      { id: 'oc6', title: 'Tidal Pools', image: 'https://picsum.photos/seed/ocean6/600/400', type: 'image', desc: 'Exploring tidal pool ecosystems' },
      { id: 'oc7', title: 'Plastic Pollution', image: 'https://picsum.photos/seed/ocean7/600/400', type: 'image', desc: 'Impact of plastic on ocean life' },
      { id: 'oc8', title: 'Mangroves', image: 'https://picsum.photos/seed/ocean8/600/400', type: 'image', desc: 'Protecting mangrove forests' },
      { id: 'oc9', title: 'Ocean Conservation', image: 'https://picsum.photos/seed/ocean9/600/400', type: 'image', desc: 'How to help protect our oceans' },
    ],
  },
};

export function getCollection(slug) {
  return savedCollections[slug] || null;
}

export function getAllCollections() {
  return Object.entries(savedCollections).map(([slug, data]) => ({
    slug,
    ...data,
    count: data.items.length,
  }));
}

export default savedCollections;