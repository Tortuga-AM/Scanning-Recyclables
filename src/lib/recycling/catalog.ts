import type { EducationalResource, ItemProfile, RecyclingBadge, RecyclingCategoryId, RecyclingProgressState } from './types';

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

const ITEM_PROFILES: ItemProfile[] = [
  {
    id: 'glass',
    label: 'Glass',
    emoji: '🫙',
    earth911Query: 'glass bottles and jars',
    keywords: ['glass', 'bottle', 'bottles', 'jar', 'jars', 'shard', 'window', 'mirror'],
    pointsBase: 55,
    disposition: 'Recycle only clean bottles and jars where accepted. Broken glass often needs a separate drop-off path.',
    safetyNotes: ['Rinse food residue away and remove lids or caps.', 'Keep shards wrapped and labeled so handlers stay safe.', 'Do not curbside recycle windows, mirrors, crystal, or ceramics unless your local program explicitly says so.'],
    specialHandling: 'Use a glass-only drop-off, bottle bank, or local recycling site that accepts glass containers.',
    educationQuery: 'glass recycling',
  },
  {
    id: 'medicine',
    label: 'Medicine',
    emoji: '💊',
    earth911Query: 'medicine take back',
    keywords: ['medicine', 'medication', 'pill', 'pills', 'tablet', 'capsule', 'prescription', 'drug', 'pharma', 'expired'],
    pointsBase: 95,
    disposition: 'Never put medicine in curbside recycling. Use a take-back or pharmacy return program.',
    safetyNotes: ['Leave medicine in its original container when possible.', 'Remove personal information from the label before drop-off.', 'Do not flush medicine unless official guidance says it is approved for flushing.'],
    specialHandling: 'Use a pharmacy take-back kiosk, police collection event, or household hazardous waste site that accepts medication.',
    educationQuery: 'medicine disposal',
  },
  {
    id: 'electronics',
    label: 'Electronics',
    emoji: '📱',
    earth911Query: 'electronics recycling',
    keywords: ['electronics', 'e-waste', 'phone', 'laptop', 'tablet', 'computer', 'charger', 'cable', 'tv', 'television', 'monitor', 'printer'],
    pointsBase: 85,
    disposition: 'Electronics need a dedicated recycler or take-back program because of batteries, metals, and screens.',
    safetyNotes: ['Back up or wipe personal data before drop-off.', 'Remove batteries when your local program asks for them separately.', 'Avoid cracking screens or opening housings unless the recycler asks you to separate parts.'],
    specialHandling: 'Use retailer take-back, certified e-waste events, or a municipal electronics recycler.',
    educationQuery: 'electronics recycling',
  },
  {
    id: 'bulky',
    label: 'Bulky item',
    emoji: '🛋️',
    earth911Query: 'bulky waste pickup',
    keywords: ['bulky', 'furniture', 'sofa', 'couch', 'mattress', 'appliance', 'dresser', 'table', 'chair', 'carpet', 'rug'],
    pointsBase: 70,
    disposition: 'Bulky items usually need special pickup, donation, or demolition diversion instead of curbside recycling.',
    safetyNotes: ['Check if the item can be donated or repaired first.', 'Separate metal, wood, or electronics components when local rules require it.', 'Keep mattresses, appliances, and upholstered pieces out of mixed recycling bins.'],
    specialHandling: 'Schedule a municipal bulky pickup or bring the item to a reuse, donation, or construction-debris site.',
    educationQuery: 'bulky item disposal',
  },
  {
    id: 'battery',
    label: 'Battery',
    emoji: '🔋',
    earth911Query: 'battery recycling',
    keywords: ['battery', 'batteries', 'lithium', 'lithium-ion', 'li-ion', 'power bank', 'aaa', 'aa', 'coin cell', 'button cell', 'rechargeable'],
    pointsBase: 90,
    disposition: 'Batteries can start fires in recycling trucks and sorting facilities, so they need a special collection stream.',
    safetyNotes: ['Tape terminals on loose lithium and button batteries before transport.', 'Keep damaged or swollen batteries away from metal objects.', 'Never toss batteries into curbside recycling or trash unless your local program explicitly allows it.'],
    specialHandling: 'Use a battery drop-off box, retailer take-back, or household hazardous waste site.',
    educationQuery: 'battery recycling',
  },
  {
    id: 'hazardous',
    label: 'Hazardous waste',
    emoji: '☣️',
    earth911Query: 'household hazardous waste',
    keywords: ['hazardous', 'paint', 'paint thinner', 'solvent', 'chemical', 'pesticide', 'poison', 'bleach', 'fuel', 'gasoline', 'aerosol', 'oil'],
    pointsBase: 100,
    disposition: 'Household hazardous waste should be kept out of recycling and often out of regular trash as well.',
    safetyNotes: ['Keep liquids in sealed original containers when possible.', 'Do not mix chemicals together.', 'Transport only to approved hazardous waste collection sites.'],
    specialHandling: 'Use a hazardous waste collection event or a permanent household hazardous waste facility.',
    educationQuery: 'household hazardous waste',
  },
  {
    id: 'plastic',
    label: 'Plastic',
    emoji: '🧴',
    earth911Query: 'plastic containers',
    keywords: ['plastic', 'bottle', 'bottles', 'container', 'containers', 'jug', 'tub', 'cup', 'tray', 'packaging'],
    pointsBase: 40,
    disposition: 'Plastic rules vary a lot by resin code, shape, and local sorting capability.',
    safetyNotes: ['Look for local acceptance of rigid containers first.', 'Keep film, foam, and dirty packaging out unless your program accepts them.', 'Empty, rinse, and dry containers before recycling.'],
    specialHandling: 'Check local curbside rules and retailer film-plastic drop-offs.',
    educationQuery: 'plastic recycling',
  },
  {
    id: 'paper',
    label: 'Paper',
    emoji: '📄',
    earth911Query: 'paper recycling',
    keywords: ['paper', 'cardboard', 'cardboard box', 'box', 'mailer', 'newspaper', 'magazine', 'office paper', 'envelope'],
    pointsBase: 35,
    disposition: 'Paper is usually recyclable when it is clean, dry, and free of food or wax contamination.',
    safetyNotes: ['Flatten boxes before putting them in the bin.', 'Keep greasy food boxes and tissues out of paper recycling unless your city says otherwise.', 'Remove plastic liners, bubble wrap, and shipping tape where practical.'],
    specialHandling: 'Use curbside paper/cardboard collection or a local paper drop-off site.',
    educationQuery: 'paper recycling',
  },
  {
    id: 'metal',
    label: 'Metal',
    emoji: '🥫',
    earth911Query: 'metal cans recycling',
    keywords: ['metal', 'aluminum', 'can', 'cans', 'tin', 'steel', 'scrap metal', 'foil'],
    pointsBase: 45,
    disposition: 'Clean metal cans and certain scrap metal items are often recyclable, but mixed pieces need checking.',
    safetyNotes: ['Rinse cans and empty food residue.', 'Keep pressurized cans and propane cylinders out of regular recycling.', 'Separate non-metal attachments where needed.'],
    specialHandling: 'Use curbside metal recycling, scrap metal drop-off, or a bottle-and-can center.',
    educationQuery: 'metal recycling',
  },
  {
    id: 'compost',
    label: 'Compost',
    emoji: '🌱',
    earth911Query: 'food scraps composting',
    keywords: ['compost', 'food scraps', 'food waste', 'banana peel', 'coffee grounds', 'yard waste', 'leaf', 'leaves', 'organic'],
    pointsBase: 45,
    disposition: 'Compostables belong in organics programs, not recycling bins.',
    safetyNotes: ['Use only compostable bags if your local facility allows them.', 'Keep plastics, glass, and metal out of organics collection.', 'Check whether meat, bones, or soiled paper are accepted.'],
    specialHandling: 'Use curbside organics, municipal compost drop-off, or backyard composting.',
    educationQuery: 'composting basics',
  },
  {
    id: 'textile',
    label: 'Textile',
    emoji: '👕',
    earth911Query: 'textile recycling',
    keywords: ['textile', 'clothing', 'clothes', 'shirt', 'pants', 'fabric', 'towel', 'blanket', 'shoe'],
    pointsBase: 50,
    disposition: 'Textiles are usually best reused, donated, or routed to a textile recycler.',
    safetyNotes: ['Separate heavily soiled or contaminated items from donations.', 'Bundle clean, dry textiles for donation or recycling.', 'Keep shoes and accessories with the collection partner that accepts them.'],
    specialHandling: 'Use a donation center, reuse store, or textile recycling drop-off.',
    educationQuery: 'textile recycling',
  },
  {
    id: 'general',
    label: 'General recycling',
    emoji: '♻️',
    earth911Query: 'recycling center',
    keywords: [],
    pointsBase: 25,
    disposition: 'When the item is unclear, start with local waste guidance and look for a dedicated drop-off or reuse option.',
    safetyNotes: ['Check local rules before using curbside bins.', 'When in doubt, keep hazardous, battery, medicine, and e-waste items separate.', 'Ask your city or hauler about special collection events.'],
    specialHandling: 'Use your local recycling directory, city guide, or reuse center.',
    educationQuery: 'recycling basics',
  },
];

const EDUCATIONAL_RESOURCES: EducationalResource[] = [
  {
    id: 'sorting-basics',
    title: 'Start with clean, empty, dry items',
    summary: 'Most recycling problems come from contamination, liquids, and food residue.',
    href: 'https://www.epa.gov/recycle',
    source: 'EPA',
    categoryIds: ['glass', 'plastic', 'paper', 'metal', 'general'],
  },
  {
    id: 'glass-basics',
    title: 'Glass container recycling',
    summary: 'Glass rules vary by city, and some programs exclude broken glass or mixed glass.',
    href: 'https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables#glass',
    source: 'EPA',
    categoryIds: ['glass'],
  },
  {
    id: 'battery-safety',
    title: 'Battery safety and drop-off',
    summary: 'Loose batteries can spark fires, so terminals should be protected before transport.',
    href: 'https://www.call2recycle.org/what-can-i-recycle/',
    source: 'Call2Recycle',
    categoryIds: ['battery', 'electronics'],
  },
  {
    id: 'medicine-return',
    title: 'Medicine take-back programs',
    summary: 'Pharmacies and public safety agencies often host medication drop-off options.',
    href: 'https://www.fda.gov/consumers/consumer-updates/where-and-how-dispose-unused-medicines',
    source: 'FDA',
    categoryIds: ['medicine'],
  },
  {
    id: 'hazardous-waste',
    title: 'Household hazardous waste',
    summary: 'Paints, solvents, pesticides, and cleaners usually require a dedicated disposal stream.',
    href: 'https://www.epa.gov/hw/household-hazardous-waste-hhw',
    source: 'EPA',
    categoryIds: ['hazardous'],
  },
  {
    id: 'electronics-reuse',
    title: 'Electronics reuse and certified recycling',
    summary: 'Data wiping, donation, and certified e-waste recyclers keep devices in better use cycles.',
    href: 'https://www.epa.gov/recycle/electronics-donation-and-recycling',
    source: 'EPA',
    categoryIds: ['electronics'],
  },
  {
    id: 'bulky-collection',
    title: 'Bulky item pickup options',
    summary: 'Large items may need a municipal pickup appointment, donation, or special drop-off.',
    href: 'https://www.epa.gov/smm/sustainable-management-materials-junk-and-other-bulky-items',
    source: 'EPA',
    categoryIds: ['bulky'],
  },
  {
    id: 'organics',
    title: 'Food scraps and composting',
    summary: 'Organics programs work best when food scraps stay out of recycling carts.',
    href: 'https://www.epa.gov/recycle/composting-home',
    source: 'EPA',
    categoryIds: ['compost'],
  },
  {
    id: 'textile-reuse',
    title: 'Reuse clothes before recycling them',
    summary: 'Donating or reselling clothing typically beats downcycling into rags or fiber fill.',
    href: 'https://www.epa.gov/smm/sustainable-management-textiles',
    source: 'EPA',
    categoryIds: ['textile'],
  },
];

const BADGES: Array<Omit<RecyclingBadge, 'unlocked'>> = [
  { id: 'first-scan', label: 'First scan', description: 'Complete your first guidance lookup.' },
  { id: 'streak-3', label: '3-day streak', description: 'Recycle on three separate days in a row.' },
  { id: 'streak-7', label: '7-day streak', description: 'Keep recycling guidance going for a full week.' },
  { id: 'special-item', label: 'Special handler', description: 'Dispose of a hazardous or special item safely.' },
  { id: 'eco-100', label: '100 points', description: 'Reach 100 points across your recycling history.' },
];

export function getItemProfile(rawText: string) {
  const normalized = normalize(rawText);
  const scored = ITEM_PROFILES.map((profile) => {
    const keywordScore = profile.keywords.reduce((score, keyword) => score + (normalized.includes(keyword) ? 1 : 0), 0);
    const labelScore = normalized.includes(profile.label.toLowerCase()) ? 3 : 0;
    const specialScore = ['medicine', 'battery', 'hazardous', 'electronics', 'bulky', 'glass'].includes(profile.id) ? 1 : 0;
    return { profile, score: keywordScore + labelScore + specialScore };
  });

  scored.sort((left, right) => right.score - left.score || right.profile.pointsBase - left.profile.pointsBase);
  const winner = scored[0];
  return {
    profile: winner.score > 0 ? winner.profile : getProfileById('general'),
    normalized,
  };
}

export function getProfileById(id: RecyclingCategoryId) {
  return ITEM_PROFILES.find((profile) => profile.id === id) ?? ITEM_PROFILES[ITEM_PROFILES.length - 1];
}

export function buildEarth911Query(profile: ItemProfile, rawText: string) {
  const normalized = normalize(rawText);
  const specific = normalized.length > 0 ? normalized : profile.label.toLowerCase();
  return `${profile.earth911Query} ${specific}`.trim();
}

export function getBadgeCatalog(): Omit<RecyclingBadge, 'unlocked'>[] {
  return BADGES.slice();
}

export function getUnlockedBadges(state: RecyclingProgressState): RecyclingBadge[] {
  const hasSpecialItem = state.history.some((entry) => ['battery', 'hazardous', 'medicine', 'electronics', 'bulky'].includes(entry.categoryId));
  return BADGES.map((badge) => ({
    ...badge,
    unlocked:
      (badge.id === 'first-scan' && state.totalScans > 0) ||
      (badge.id === 'streak-3' && state.currentStreak >= 3) ||
      (badge.id === 'streak-7' && state.currentStreak >= 7) ||
      (badge.id === 'special-item' && hasSpecialItem) ||
      (badge.id === 'eco-100' && state.totalPoints >= 100),
  }));
}

export function getEducationalFallbackResources(profile: ItemProfile): EducationalResource[] {
  const scored = EDUCATIONAL_RESOURCES.map((resource) => {
    const related = resource.categoryIds.includes(profile.id) ? 3 : 0;
    const generic = resource.categoryIds.includes('general') ? 1 : 0;
    return { resource, score: related + generic };
  });

  scored.sort((left, right) => right.score - left.score);
  return scored.slice(0, 4).map(({ resource }) => resource);
}
