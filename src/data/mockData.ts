import { ServiceCategory, Worker, User, JobRequest, ServiceWorkItem } from '../types/index.ts';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'beauty_women',
    title: 'Beauty & Salon at Home',
    description: 'Expert beauticians for waxing, facial, manicure, pedicure, hair spa & party cleanup with disposable kits.',
    iconName: 'Sparkles',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Flat ₹199 Visit',
    popularIssues: [
      'O3+ Shine & Glow Facial with cleanup',
      'Full honey chocolate waxing (arms, legs, underarms)',
      'Deluxe spa manicure & pedicure with nail buffing',
      'Hair spa deep nourishing treatment & split-end trim',
      'Threading (eyebrow, upper lip) & fruit face bleach',
      'Pre-wedding & party glow skin prep package'
    ],
    toolsProvided: ['Single-use disposable bedsheet', 'Sterilized salon tool kit', 'Wax warmer', 'Facial steamer', 'Organic branded creams']
  },
  {
    id: 'grooming_men',
    title: "Men's Grooming & Salon",
    description: "Doorstep men's haircuts, beard styling, charcoal detan face cleanup & relaxing head massages.",
    iconName: 'Sparkles',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 45,
    badge: 'Flat ₹199 Visit',
    popularIssues: [
      "Men's classic fade / crew haircut & hair wash",
      'Beard styling, sharp line trimming & conditioning oil',
      'Detan face pack & blackhead vacuum extraction',
      'Relaxing 20-min Ayurvedic head & shoulder massage',
      'Hair colour application & ammonia-free grey touchup'
    ],
    toolsProvided: ['Professional cordless clippers', 'Sterilized scissor kit', 'Cape & neck strips', 'Beard straightener', 'Organic massage oils']
  },
  {
    id: 'vehicle_care',
    title: 'Doorstep Car & Bike Care',
    description: 'Pressure foam car wash, deep interior vacuuming, bike servicing & emergency battery jumpstart.',
    iconName: 'Zap',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 45,
    badge: 'Flat ₹199 Visit',
    popularIssues: [
      'Eco pressure foam wash & tyre dressing for hatchback/SUV',
      'Deep interior vacuum, dashboard polish & upholstery shampoo',
      'Two-wheeler doorstep engine oil change & brake tuning',
      'Emergency 12V car battery jumpstart & voltage alternator test'
    ],
    toolsProvided: ['Portable pressure washer', 'Heavy vacuum extractor', 'Microfiber towels', 'Heavy jumper cables', 'Digital tyre inflator']
  },
  {
    id: 'home_health',
    title: 'Elderly Care & Home Nurse',
    description: 'Compassionate assistance for seniors, vital checkups, post-surgery dressing & home caregiver visits.',
    iconName: 'Shield',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Flat ₹199 Visit',
    popularIssues: [
      'Elderly vital signs check (BP, blood sugar, SpO2, pulse)',
      'Bedridden senior companion & mobility exercise support',
      'Sterile wound dressing & suture care nurse visit',
      'Medication reminder & IV drip monitoring assistance'
    ],
    toolsProvided: ['Digital BP monitor', 'Glucometer', 'Pulse oximeter', 'First-aid & sterile dressing kit']
  },
  {
    id: 'gadget_repair',
    title: 'Laptop, PC & WiFi Setup',
    description: 'Doorstep computer repair, SSD/RAM speed booster, Windows/Mac software fix & WiFi range extender.',
    iconName: 'Tv',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 45,
    badge: 'Flat ₹199 Visit',
    popularIssues: [
      'Laptop slow performance, thermal paste & SSD upgrade',
      'Laptop broken screen or keyboard key replacement',
      'WiFi dead zone fix & dual-band mesh router setup',
      'Virus / malware cleanup and Windows reinstall without data loss'
    ],
    toolsProvided: ['Precision anti-static screwdriver set', 'Thermal paste', 'External test display', 'Bootable recovery drives']
  },
  {
    id: 'plumbing',
    title: 'Plumbing & Pipes',
    description: 'Leak detection, tap replacement, toilet flush, clogged drain, motor pump & pipeline repair.',
    iconName: 'Wrench',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 45,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Burst or dripping pipe leak',
      'Clogged kitchen sink / bathroom drain',
      'Flush tank leakage / siphon replacement',
      'Overhead water tank deep clean / ball valve',
      'Motor pump priming & capacitor replacement',
      'Bathroom diverter, mixer & shower repair',
      'Water meter & main pipeline valve change'
    ],
    toolsProvided: ['Heavy pipe wrench', 'Drain auger snake', 'Teflon sealant tape', 'Pressure gauge', 'Flange tool']
  },
  {
    id: 'electrical',
    title: 'Electrical & Wiring',
    description: 'Short circuits, MCB breaker tripping, inverter connection, ceiling fans, switches & chandeliers.',
    iconName: 'Zap',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 45,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Main MCB tripping repeatedly',
      'Dead power socket (16A / 6A) & switchboard spark',
      'Ceiling fan installation / regulator change',
      'Inverter battery setup, wiring & bypass',
      'Geyser switchboard overheating & heavy wiring',
      'Short circuit tracing & concealed wire repair',
      'Chandelier, pendant & track light hanging'
    ],
    toolsProvided: ['Digital clamp multimeter', 'Insulated pliers set', 'Neon voltage tester', 'Wire stripper', 'Thermal camera']
  },
  {
    id: 'ac_cooling',
    title: 'AC & Air Cooling',
    description: 'Split & window AC power jet servicing, gas charging (R32/R410A), installation & PCB repair.',
    iconName: 'Snowflake',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Split AC deep power jet service (Indoor + Outdoor)',
      'AC gas leak detection & refrigerant refill',
      'AC water dripping from indoor unit inside room',
      'AC not cooling / compressor tripping',
      'AC uninstallation & wall bracket installation',
      'AC PCB circuit board & sensor replacement',
      'Air cooler motor & honey-comb pad replacement'
    ],
    toolsProvided: ['High-pressure jet wash pump', 'Refrigerant manifold gauge', 'Vacuum pump', 'Fin comb']
  },
  {
    id: 'appliances',
    title: 'Appliance Repair',
    description: 'Washing machine, refrigerator, microwave oven, kitchen chimney & gas stove repair.',
    iconName: 'Tv',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Washing machine not spinning / drain pump error',
      'Refrigerator cooling low / freezer ice frosting',
      'Microwave oven not heating / spark inside',
      'Kitchen chimney motor grease choke & deep clean',
      'Gas stove burner flame low / auto-ignition repair',
      'Television TV wall mount & display backlight check',
      'Dishwasher drainage error & spray arm clean'
    ],
    toolsProvided: ['Capacitor tester', 'Motor bearing puller', 'Thermal detector', 'Oven magnetron probe']
  },
  {
    id: 'ro_purifier',
    title: 'RO Water Purifier',
    description: 'Filter candle replacement, RO membrane, sediment & carbon filter, TDS adjustment & pump fix.',
    iconName: 'Droplets',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 45,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Complete RO service & pre-filter candle change',
      'RO membrane replacement & high TDS adjustment',
      'Water purifier continuous beep / alert sound',
      'RO water leakage from pipes / elbows',
      'RO booster pump replacement (24V / 36V)',
      'Sediment, pre-carbon & post-carbon cartridge change',
      'RO uninstallation & shifting to new house'
    ],
    toolsProvided: ['Digital TDS meter', 'Filter wrench', 'High pressure pipe cutter', 'Teflon fittings']
  },
  {
    id: 'carpentry',
    title: 'Carpentry & Furniture',
    description: 'Sliding wardrobe doors, hydraulic bed lift, modular kitchen drawers, locks & IKEA assembly.',
    iconName: 'Hammer',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 45,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Sliding wardrobe roller track alignment & wheels',
      'Bed hydraulic gas lift mechanism replacement',
      'Main door latch & wooden planer smoothening',
      'Modular kitchen drawer telescopic channels change',
      'Curtain rod, window blinds & drapery bracket fixing',
      'Furniture assembly (IKEA, Urban Ladder, Pepperfry)',
      'Wall shelf, mirror & photo frame drill mounting'
    ],
    toolsProvided: ['Cordless impact drill', 'Spirit level', 'Wood chisels', 'Heavy clamps', 'Electric planer']
  },
  {
    id: 'cleaning',
    title: 'Deep Home Cleaning',
    description: 'Full home deep sanitization, bathroom hard water descaling, sofa shampooing & kitchen degreasing.',
    iconName: 'Sparkles',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 90,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Complete 1BHK / 2BHK / 3BHK move-in deep clean',
      'Bathroom hard water stain removal & tile scrubbing',
      'Sofa & mattress deep foam shampooing & vacuum',
      'Kitchen chimney, tiles & exhaust degreasing',
      'Balcony cleaning & floor machine buffing',
      'Fridge & kitchen appliance deep interior clean'
    ],
    toolsProvided: ['Wet & dry industrial vacuum', 'High-pressure steam jet', 'Single disc scrubber', 'Microfiber kit']
  },
  {
    id: 'pest_control',
    title: 'Pest Control & Termite',
    description: 'Cockroach herbal gel, anti-termite drill treatment, bed bugs, ants & mosquito fogging.',
    iconName: 'Bug',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Cockroach herbal gel & odorless spray treatment',
      'Bed bugs double-session intense eradication',
      'Anti-termite wall drilling & chemical barrier injection',
      'Ants & crawling insect kitchen defense',
      'Balcony pigeon safety netting installation'
    ],
    toolsProvided: ['Odorless Bayer spray pump', 'Herbal gel gun', 'Rotary masonry drill', 'Safety mask']
  },
  {
    id: 'locksmith',
    title: 'Locksmith & Smart Locks',
    description: 'Emergency home lockout, Godrej deadbolt installation, smart digital biometric locks & key duplication.',
    iconName: 'Key',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 30,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Locked out of house / apartment door opening',
      'Godrej double cylinder lock replacement',
      'Smart WiFi biometric fingerprint lock setup',
      'Broken key extracted from door cylinder',
      'Main wooden door security chain & peep-hole',
      'Drawer, wardrobe & cash locker lock repair'
    ],
    toolsProvided: ['Precision lock pick kit', 'Hole saw cutter', 'Key duplicator', 'Mortise chisel', 'Torque wrenches']
  },
  {
    id: 'painting',
    title: 'Painting & Damp Wall Treatment',
    description: 'Dampness seepage waterproofing, Asian Paints interior wall touch-up, putty scraping & balcony coat.',
    iconName: 'Paintbrush',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Seepage dampness patch & waterproof coat',
      'Single room Royale emulsion repaint',
      'Drill hole plaster putty & primer touch-up',
      'Balcony railing anti-rust enamel painting',
      'Ceiling water leakage spot seal & putty',
      'Designer stencil or accent wall painting'
    ],
    toolsProvided: ['Drop sheets', 'Roller brushes', 'Putty blades', 'Wall sanding machine', 'Moisture meter']
  },
  {
    id: 'roofing',
    title: 'Roof, Terrace & Water Leaks',
    description: 'Terrace rainwater drain clearing, roof sheet repair, Dr. Fixit waterproofing membrane coating.',
    iconName: 'Home',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Terrace drain pipe leaf choke & rainwater clearing',
      'Roof tile cracks water seepage treatment',
      'Sheet shade screw washer leak fixing',
      'Parapet wall crack silicon seal & bitumen tape',
      'Dr. Fixit terrace waterproofing membrane coat'
    ],
    toolsProvided: ['Telescopic ladder', 'Waterproofing bitumen kit', 'High-strength silicone sealant', 'Gas torch']
  },
  {
    id: 'cctv_smart_home',
    title: 'CCTV & Smart Home Security',
    description: 'CCTV camera installation, smart video doorbells, motion sensor lights & WiFi switch automation.',
    iconName: 'Shield',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'CCTV camera installation & DVR / NVR wiring',
      'Smart WiFi video doorbell installation',
      'Smart automation switchboard setup (WiFi/Zigbee)',
      'Motion sensor security lights for corridor / gate',
      'Wi-Fi mesh router setup & cabling for home'
    ],
    toolsProvided: ['Crimping tool', 'RJ45 cable tester', 'Drill bits', 'BNC connectors']
  },
  {
    id: 'masonry_tiling',
    title: 'Masonry & Tile Repair',
    description: 'Broken floor tile replacement, epoxy grouting, kitchen slab repair, wall drilling & cement patch.',
    iconName: 'Layers',
    basePrice: 199,
    priceUnit: 'flat',
    estDurationMinutes: 60,
    badge: 'Only ₹199 Visit',
    popularIssues: [
      'Broken bathroom or floor tile replacement',
      'Epoxy grouting for bathroom tile joints & leak prevention',
      'Granite kitchen countertop crack repair',
      'Drilling core hole for AC / chimney duct pipe',
      'Cement wall plaster crack patch & smoothening'
    ],
    toolsProvided: ['Tile cutter machine', 'Grout float', 'Angle grinder', 'Spirit level']
  }
];

export const ALL_SERVICE_WORKS: ServiceWorkItem[] = [
  // Salon & Beauty at Home Works
  {
    id: 'work-facial-o3',
    categoryId: 'beauty_women',
    categoryTitle: 'Beauty & Salon at Home',
    title: 'O3+ Shine & Glow Facial with Cleanup',
    description: 'Deep pore cleansing, steam extraction, exfoliating scrub, lymphatic massage & O3+ whitening rubber mask for glowing skin.',
    visitingFee: 199,
    estimatedLabor: 599,
    estDurationMinutes: 60,
    badge: 'Bestseller',
    keywords: ['facial', 'beauty', 'glow', 'o3', 'cleanup', 'skin', 'salon', 'parlour', 'face', 'massage'],
    emergencyAvailable: false
  },
  {
    id: 'work-full-waxing',
    categoryId: 'beauty_women',
    categoryTitle: 'Beauty & Salon at Home',
    title: 'Rica / Honey Full Arms & Full Legs Waxing',
    description: 'Painless hair removal using premium branded wax with post-wax soothing aloe lotion & disposable hygiene strips.',
    visitingFee: 199,
    estimatedLabor: 449,
    estDurationMinutes: 45,
    badge: 'Popular',
    keywords: ['waxing', 'rica', 'honey', 'wax', 'hair removal', 'arms', 'legs', 'underarms', 'beauty'],
    emergencyAvailable: false
  },
  {
    id: 'work-pedicure-manicure',
    categoryId: 'beauty_women',
    categoryTitle: 'Beauty & Salon at Home',
    title: 'Deluxe Rose & Crystal Spa Pedicure + Manicure',
    description: 'Foot soaking, dead skin cuticle removal, sea salt scrub, moisturizing massage & nail shaping and polish.',
    visitingFee: 199,
    estimatedLabor: 499,
    estDurationMinutes: 50,
    badge: 'Spa at Home',
    keywords: ['pedicure', 'manicure', 'feet', 'nails', 'hands', 'spa', 'cuticle', 'massage', 'beauty'],
    emergencyAvailable: false
  },
  {
    id: 'work-hair-spa',
    categoryId: 'beauty_women',
    categoryTitle: 'Beauty & Salon at Home',
    title: 'L’Oreal Deep Conditioning Hair Spa & Trim',
    description: 'Nourishing scalp massage, steam treatment, split-ends dusting & hair serum application for silky smooth hair.',
    visitingFee: 199,
    estimatedLabor: 649,
    estDurationMinutes: 50,
    badge: 'Top Rated',
    keywords: ['hair spa', 'haircut', 'trim', 'loreal', 'hair treatment', 'scalp', 'split ends', 'beauty'],
    emergencyAvailable: false
  },
  {
    id: 'work-threading-bleach',
    categoryId: 'beauty_women',
    categoryTitle: 'Beauty & Salon at Home',
    title: 'Eyebrow Threading, Upper Lip & Fruit Bleach',
    description: 'Precise eyebrow arching, upper lip threading, and gentle herbal fruit bleach to instantly lighten tan.',
    visitingFee: 199,
    estimatedLabor: 199,
    estDurationMinutes: 25,
    badge: 'Quick 25m',
    keywords: ['threading', 'eyebrow', 'upper lip', 'bleach', 'tan', 'face bleach', 'beauty'],
    emergencyAvailable: true
  },

  // Men's Grooming Works
  {
    id: 'work-mens-haircut',
    categoryId: 'grooming_men',
    categoryTitle: "Men's Grooming & Salon",
    title: "Men's Haircut, Style & Refreshing Wash",
    description: 'Professional scissors and clipper cut, fade, scissor texturing, styling with matte clay & neck clean up.',
    visitingFee: 199,
    estimatedLabor: 180,
    estDurationMinutes: 35,
    badge: 'Doorstep Pro',
    keywords: ['mens haircut', 'hair cut', 'fade', 'barber', 'salon', 'trim', 'mens grooming'],
    emergencyAvailable: true
  },
  {
    id: 'work-beard-styling',
    categoryId: 'grooming_men',
    categoryTitle: "Men's Grooming & Salon",
    title: 'Beard Trim, Sharp Line Razor Edge & Conditioning',
    description: 'Precise shape-up with single-use blade, hot towel wrap, organic beard oil massage & mustache trim.',
    visitingFee: 199,
    estimatedLabor: 140,
    estDurationMinutes: 25,
    badge: 'Popular',
    keywords: ['beard', 'trim', 'shave', 'styling', 'mustache', 'barber', 'razor', 'grooming'],
    emergencyAvailable: true
  },
  {
    id: 'work-head-massage-men',
    categoryId: 'grooming_men',
    categoryTitle: "Men's Grooming & Salon",
    title: 'Stress Relief Ayurvedic Head & Shoulder Massage (20m)',
    description: 'Herbal Brahmi/Bhringraj warm oil deep acupressure massage to alleviate headache, eye strain & muscle tension.',
    visitingFee: 199,
    estimatedLabor: 199,
    estDurationMinutes: 25,
    badge: 'Relaxing',
    keywords: ['head massage', 'champi', 'oil massage', 'stress relief', 'ayurvedic', 'massage', 'relax'],
    emergencyAvailable: true
  },

  // Vehicle Care Works
  {
    id: 'work-car-foam-wash',
    categoryId: 'vehicle_care',
    categoryTitle: 'Doorstep Car & Bike Care',
    title: 'Eco High-Pressure Foam Car Wash & Vacuum',
    description: 'Snow foam shampoo, high-pressure rinse, tyre dresser, deep carpet/seat vacuuming & fragrance mist at doorstep.',
    visitingFee: 199,
    estimatedLabor: 350,
    estDurationMinutes: 50,
    badge: 'Doorstep Wash',
    keywords: ['car wash', 'foam wash', 'car cleaning', 'vacuum', 'car interior', 'car care', 'vehicle'],
    emergencyAvailable: true
  },
  {
    id: 'work-car-battery-jumpstart',
    categoryId: 'vehicle_care',
    categoryTitle: 'Doorstep Car & Bike Care',
    title: 'Emergency 12V Car Battery Jumpstart (30-Min Arrival)',
    description: 'Instant arrival with heavy-duty copper jumper cables & booster pack to start dead battery vehicle.',
    visitingFee: 199,
    estimatedLabor: 250,
    estDurationMinutes: 25,
    badge: 'SOS 30m',
    keywords: ['battery jumpstart', 'dead battery', 'car won’t start', 'jumper cable', 'battery emergency', 'sos'],
    emergencyAvailable: true
  },

  // Home Healthcare Works
  {
    id: 'work-home-vitals-check',
    categoryId: 'home_health',
    categoryTitle: 'Elderly Care & Home Nurse',
    title: 'Senior Health Checkup (BP, Sugar, SpO2, Pulse)',
    description: 'Certified caregiver / nurse visit to accurately measure and log vital parameters for elderly home care.',
    visitingFee: 199,
    estimatedLabor: 150,
    estDurationMinutes: 30,
    badge: 'Care Visit',
    keywords: ['nurse', 'elderly care', 'bp check', 'sugar test', 'blood pressure', 'senior health', 'home care'],
    emergencyAvailable: true
  },

  // Gadget Repair Works
  {
    id: 'work-laptop-ssd-speed',
    categoryId: 'gadget_repair',
    categoryTitle: 'Laptop, PC & WiFi Setup',
    title: 'Laptop Speed Booster: SSD Upgrade & Thermal Paste',
    description: 'Eliminate slow booting, clean clogged heat sinks, apply Arctic MX-4 thermal paste and clone Windows to high-speed NVMe SSD.',
    visitingFee: 199,
    estimatedLabor: 399,
    estDurationMinutes: 50,
    badge: 'Speed Boost',
    keywords: ['laptop repair', 'ssd upgrade', 'slow laptop', 'pc repair', 'thermal paste', 'computer', 'wifi'],
    emergencyAvailable: true
  },

  // Plumbing Works
  {
    id: 'work-tap-leak',
    categoryId: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    title: 'Tap Replacement & Leak Repair',
    description: 'Fix dripping bibcock, pillar cock, mixer spindle or replace with new tap. Teflon sealing and flow test included.',
    visitingFee: 199,
    estimatedLabor: 120,
    estDurationMinutes: 30,
    badge: 'Popular',
    keywords: ['tap', 'leak', 'faucet', 'dripping', 'bibcock', 'mixer', 'water', 'spindle', 'washer', 'plumber'],
    emergencyAvailable: true
  },
  {
    id: 'work-drain-unclog',
    categoryId: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    title: 'Clogged Kitchen Sink or Drain Unclog',
    description: 'Clear solid grease, hair and sediment choke in kitchen sink, bathroom nahani trap or waste pipe using drain auger.',
    visitingFee: 199,
    estimatedLabor: 180,
    estDurationMinutes: 40,
    badge: 'Fast Response',
    keywords: ['drain', 'clog', 'sink', 'blocked', 'choke', 'water stagnation', 'pipe choke', 'nahani trap'],
    emergencyAvailable: true
  },
  {
    id: 'work-flush-tank',
    categoryId: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    title: 'Toilet Flush Tank & Commode Leakage Fix',
    description: 'Repair continuously running water, siphon kit replacement, flush valve washer & cistern ball valve adjustment.',
    visitingFee: 199,
    estimatedLabor: 190,
    estDurationMinutes: 35,
    badge: 'Water Saver',
    keywords: ['flush', 'toilet', 'commode', 'cistern', 'siphon', 'leakage', 'flush button', 'running water'],
    emergencyAvailable: true
  },
  {
    id: 'work-pipe-burst',
    categoryId: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    title: 'Pipeline Burst & Concealed Leak Repair',
    description: 'Emergency shutoff, pipe crack coupling, CPVC/UPVC/GI pipe solvent weld or joint replacement.',
    visitingFee: 199,
    estimatedLabor: 290,
    estDurationMinutes: 60,
    badge: 'Emergency 30m',
    keywords: ['burst', 'pipe', 'leak', 'flood', 'cpvc', 'upvc', 'water leak', 'concealed', 'emergency'],
    emergencyAvailable: true
  },
  {
    id: 'work-water-tank-clean',
    categoryId: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    title: 'Overhead / Sump Water Tank Deep Cleaning',
    description: 'Mechanical de-sludging, high-pressure jet washing, anti-bacterial UV treatment & float valve check.',
    visitingFee: 199,
    estimatedLabor: 499,
    estDurationMinutes: 75,
    badge: 'Health & Safe',
    keywords: ['tank', 'water tank', 'sintex', 'sump', 'cleaning', 'mud', 'algae', 'float valve'],
    emergencyAvailable: false
  },
  {
    id: 'work-motor-pump',
    categoryId: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    title: 'Water Motor Pump Repair & Starter Capacitor',
    description: 'Fix motor humming without pumping, priming air-lock issue, capacitor replacement or automatic water level controller.',
    visitingFee: 199,
    estimatedLabor: 250,
    estDurationMinutes: 45,
    badge: 'Essential',
    keywords: ['motor', 'pump', 'water pump', 'capacitor', 'air lock', 'priming', 'kirloskar', 'crompton'],
    emergencyAvailable: true
  },
  {
    id: 'work-diverter-shower',
    categoryId: 'plumbing',
    categoryTitle: 'Plumbing & Pipes',
    title: 'Bathroom Diverter, Shower & Mixer Repair',
    description: 'Repair single lever diverter cartridge, shower head scaling unclog, hot & cold water mixture pressure balance.',
    visitingFee: 199,
    estimatedLabor: 220,
    estDurationMinutes: 45,
    badge: 'Expert Plumber',
    keywords: ['diverter', 'shower', 'mixer', 'jaguar', 'grohe', 'cartridge', 'hot cold', 'bathroom fitting'],
    emergencyAvailable: false
  },

  // Electrical Works
  {
    id: 'work-mcb-tripping',
    categoryId: 'electrical',
    categoryTitle: 'Electrical & Wiring',
    title: 'Main MCB Tripping & Short Circuit Diagnostic',
    description: 'Trace ground fault, short circuit or overloaded breaker. Replace faulty single/double pole MCB or isolator.',
    visitingFee: 199,
    estimatedLabor: 220,
    estDurationMinutes: 45,
    badge: 'Safety Critical',
    keywords: ['mcb', 'tripping', 'short circuit', 'power cut', 'breaker', 'spark', 'fuse', 'electrician'],
    emergencyAvailable: true
  },
  {
    id: 'work-switchboard-spark',
    categoryId: 'electrical',
    categoryTitle: 'Electrical & Wiring',
    title: 'Switchboard Repair & 16A/6A Socket Replacement',
    description: 'Replace burned out switches, loose connection tightening, modular plate fixing & heavy appliance socket install.',
    visitingFee: 199,
    estimatedLabor: 140,
    estDurationMinutes: 30,
    badge: 'Quick Fix',
    keywords: ['switch', 'socket', 'plug', 'switchboard', 'spark', 'burnt', 'anchor', 'havells', 'electrician'],
    emergencyAvailable: true
  },
  {
    id: 'work-ceiling-fan',
    categoryId: 'electrical',
    categoryTitle: 'Electrical & Wiring',
    title: 'Ceiling Fan Installation & Regulator Repair',
    description: 'New fan hanging with downrod & safety wire, capacitor change for slow fan, or electronic regulator replacement.',
    visitingFee: 199,
    estimatedLabor: 160,
    estDurationMinutes: 35,
    badge: 'Top Booked',
    keywords: ['fan', 'ceiling fan', 'regulator', 'slow fan', 'capacitor', 'bldc fan', 'hanging'],
    emergencyAvailable: false
  },
  {
    id: 'work-inverter-battery',
    categoryId: 'electrical',
    categoryTitle: 'Electrical & Wiring',
    title: 'Inverter & Battery Wiring, Setup or Bypass',
    description: 'Connect home backup inverter, distilled water top-up, battery terminal corrosion cleaning & emergency bypass switch.',
    visitingFee: 199,
    estimatedLabor: 280,
    estDurationMinutes: 45,
    badge: 'Power Backup',
    keywords: ['inverter', 'battery', 'luminous', 'microtek', 'backup', 'power outage', 'bypass'],
    emergencyAvailable: true
  },
  {
    id: 'work-geyser-wiring',
    categoryId: 'electrical',
    categoryTitle: 'Electrical & Wiring',
    title: 'Geyser Power Socket (25A) & Element Wiring',
    description: 'Heavy duty 20A/25A metal clad socket installation, MCB protection and internal heating coil thermostat wire check.',
    visitingFee: 199,
    estimatedLabor: 190,
    estDurationMinutes: 40,
    badge: 'Heavy Load',
    keywords: ['geyser', 'water heater', 'socket', 'thermostat', 'power plug', 'shock', 'heating'],
    emergencyAvailable: true
  },
  {
    id: 'work-chandelier-light',
    categoryId: 'electrical',
    categoryTitle: 'Electrical & Wiring',
    title: 'Chandelier, Hanging Pendant & Track Light Fitting',
    description: 'Drill ceiling anchor, assemble heavy crystal/glass chandelier, balance arms and complete wiring.',
    visitingFee: 199,
    estimatedLabor: 350,
    estDurationMinutes: 60,
    badge: 'Decor Pro',
    keywords: ['chandelier', 'hanging light', 'pendant', 'track light', 'ceiling light', 'led strip', 'profile light'],
    emergencyAvailable: false
  },

  // AC & Cooling Works
  {
    id: 'work-ac-jet-service',
    categoryId: 'ac_cooling',
    categoryTitle: 'AC & Air Cooling',
    title: 'Split AC Power Jet Deep Servicing',
    description: 'High-pressure water jet cleaning of indoor cooling coils, blower fan, drainage tray & outdoor condenser unit.',
    visitingFee: 199,
    estimatedLabor: 449,
    estDurationMinutes: 60,
    badge: 'Best Seller',
    keywords: ['ac', 'air conditioner', 'ac service', 'jet service', 'cooling', 'coil clean', 'split ac', 'outdoor unit'],
    emergencyAvailable: false
  },
  {
    id: 'work-ac-gas-refill',
    categoryId: 'ac_cooling',
    categoryTitle: 'AC & Air Cooling',
    title: 'AC Gas Leak Testing & Full Gas Charging',
    description: 'Nitrogen leak test, copper flare nut tightening, vacuuming & complete gas refill (R32 / R410A / R22) with 60-day warranty.',
    visitingFee: 199,
    estimatedLabor: 599,
    estDurationMinutes: 60,
    badge: 'Chilling Cool',
    keywords: ['ac gas', 'gas charging', 'r32', 'r410a', 'gas leak', 'not cooling', 'warm air', 'ac refill'],
    emergencyAvailable: true
  },
  {
    id: 'work-ac-water-leak',
    categoryId: 'ac_cooling',
    categoryTitle: 'AC & Air Cooling',
    title: 'AC Indoor Unit Water Dripping Repair',
    description: 'Flush clogged drain pipe, level indoor mounting plate, unblock drain tray sludge and replace insulation sleeve.',
    visitingFee: 199,
    estimatedLabor: 199,
    estDurationMinutes: 35,
    badge: 'Quick Fix',
    keywords: ['ac water', 'water leakage', 'water dripping', 'drain pipe', 'indoor unit water', 'overflow'],
    emergencyAvailable: true
  },
  {
    id: 'work-ac-install',
    categoryId: 'ac_cooling',
    categoryTitle: 'AC & Air Cooling',
    title: 'AC Installation / Uninstallation with Bracket',
    description: 'Mount indoor unit with spirit level, core drill wall for copper piping, mount outdoor heavy bracket & vacuum lines.',
    visitingFee: 199,
    estimatedLabor: 699,
    estDurationMinutes: 90,
    badge: 'Certified Tech',
    keywords: ['ac install', 'ac mounting', 'uninstall ac', 'shift ac', 'bracket', 'copper pipe', 'drilling'],
    emergencyAvailable: false
  },

  // Appliance Repair Works
  {
    id: 'work-washing-machine',
    categoryId: 'appliances',
    categoryTitle: 'Appliance Repair',
    title: 'Washing Machine Repair (Spin / Drain / Noise)',
    description: 'Fix E2/OE drain error, drum vibration, drive belt, water inlet valve, or PCB control board for top/front load.',
    visitingFee: 199,
    estimatedLabor: 290,
    estDurationMinutes: 45,
    badge: 'All Brands',
    keywords: ['washing machine', 'drum', 'spin', 'drain', 'lg', 'samsung', 'ifb', 'whirlpool', 'front load', 'top load'],
    emergencyAvailable: true
  },
  {
    id: 'work-refrigerator-fix',
    categoryId: 'appliances',
    categoryTitle: 'Appliance Repair',
    title: 'Refrigerator Cooling Issue & Compressor Relay Fix',
    description: 'Repair bottom compartment not cooling, frost buildup, clicking starter relay, thermostat sensor or gas leakage.',
    visitingFee: 199,
    estimatedLabor: 280,
    estDurationMinutes: 45,
    badge: 'Essential',
    keywords: ['fridge', 'refrigerator', 'compressor', 'cooling', 'ice', 'defrost', 'single door', 'double door'],
    emergencyAvailable: true
  },
  {
    id: 'work-chimney-clean',
    categoryId: 'appliances',
    categoryTitle: 'Appliance Repair',
    title: 'Kitchen Chimney Deep Degreasing & Duct Pipe',
    description: 'Clean heavy oil & grease from baffle / filter-less mesh, inspect blower motor, carbon filter and duct pipe replacement.',
    visitingFee: 199,
    estimatedLabor: 349,
    estDurationMinutes: 60,
    badge: 'Smoke Free',
    keywords: ['chimney', 'kitchen chimney', 'grease', 'baffle filter', 'fringe', 'exhaust duct', 'suction'],
    emergencyAvailable: false
  },
  {
    id: 'work-microwave-repair',
    categoryId: 'appliances',
    categoryTitle: 'Appliance Repair',
    title: 'Microwave Oven Repair (No Heat / Sparking)',
    description: 'Replace magnetron, high voltage diode/capacitor, mica sheet replacement, touch panel repair & turntable motor.',
    visitingFee: 199,
    estimatedLabor: 250,
    estDurationMinutes: 40,
    badge: 'Bench Tested',
    keywords: ['microwave', 'oven', 'not heating', 'spark', 'magnetron', 'mica sheet', 'turntable', 'convection'],
    emergencyAvailable: false
  },
  {
    id: 'work-gas-stove-hob',
    categoryId: 'appliances',
    categoryTitle: 'Appliance Repair',
    title: 'Gas Stove & Built-in Hob Burner Repair',
    description: 'Unclog low flame brass burners, fix auto-ignition spark button, gas pipe leak test and nozzle calibration.',
    visitingFee: 199,
    estimatedLabor: 180,
    estDurationMinutes: 35,
    badge: 'Kitchen Safe',
    keywords: ['gas stove', 'hob', 'burner', 'low flame', 'auto ignition', 'gas leak', 'prestige', 'hindware'],
    emergencyAvailable: true
  },

  // RO Water Purifier Works
  {
    id: 'work-ro-candle-change',
    categoryId: 'ro_purifier',
    categoryTitle: 'RO Water Purifier',
    title: 'RO Pre-Filter Candle & Routine Servicing',
    description: 'Replace spun polypropylene pre-filter candle, clean housing, flush sediment chamber and test TDS levels.',
    visitingFee: 199,
    estimatedLabor: 150,
    estDurationMinutes: 30,
    badge: 'Pure Water',
    keywords: ['ro', 'water purifier', 'candle', 'filter', 'sediment', 'kent', 'aquaguard', 'pureit', 'tds'],
    emergencyAvailable: false
  },
  {
    id: 'work-ro-membrane-change',
    categoryId: 'ro_purifier',
    categoryTitle: 'RO Water Purifier',
    title: 'RO Membrane & Carbon Filter Replacement',
    description: 'Replace 75/80 GPD high-rejection RO membrane, activated carbon filter, post-carbon cartridge and calibrate TDS adjuster.',
    visitingFee: 199,
    estimatedLabor: 260,
    estDurationMinutes: 45,
    badge: 'High TDS Fix',
    keywords: ['membrane', 'ro membrane', 'high tds', 'carbon filter', 'taste', 'purifier', 'filmtec'],
    emergencyAvailable: false
  },
  {
    id: 'work-ro-pump-repair',
    categoryId: 'ro_purifier',
    categoryTitle: 'RO Water Purifier',
    title: 'RO Booster Pump & SMPS Adapter Repair',
    description: 'Diagnose continuous buzzing, low water production pressure or dead power adapter (24V/36V SMPS).',
    visitingFee: 199,
    estimatedLabor: 280,
    estDurationMinutes: 45,
    badge: 'Fast Pressure',
    keywords: ['ro pump', 'booster pump', 'smps', 'adapter', 'no water', 'slow water', 'buzzer beep'],
    emergencyAvailable: true
  },

  // Carpentry & Furniture Works
  {
    id: 'work-wardrobe-sliding',
    categoryId: 'carpentry',
    categoryTitle: 'Carpentry & Furniture',
    title: 'Sliding Wardrobe Door Track & Roller Repair',
    description: 'Fix jumping or stuck sliding door, replace worn bottom nylon wheels/rollers, re-align top track and soft-close damper.',
    visitingFee: 199,
    estimatedLabor: 240,
    estDurationMinutes: 45,
    badge: 'Smooth Glide',
    keywords: ['sliding door', 'wardrobe', 'cupboard', 'roller', 'track', 'closet', 'wheels', 'carpenter'],
    emergencyAvailable: false
  },
  {
    id: 'work-bed-hydraulic',
    categoryId: 'carpentry',
    categoryTitle: 'Carpentry & Furniture',
    title: 'Hydraulic Bed Lift Gas Spring Replacement',
    description: 'Replace weak or leaking hydraulic gas pump pistons (100kg/150kg/200kg) for effortless bed storage lifting.',
    visitingFee: 199,
    estimatedLabor: 280,
    estDurationMinutes: 45,
    badge: 'Heavy Duty',
    keywords: ['hydraulic', 'bed', 'gas spring', 'bed lift', 'piston', 'heavy lift', 'box bed', 'storage bed'],
    emergencyAvailable: false
  },
  {
    id: 'work-drawer-channel',
    categoryId: 'carpentry',
    categoryTitle: 'Carpentry & Furniture',
    title: 'Modular Kitchen Drawer Channel / Runner Change',
    description: 'Replace bent or rusted telescopic ball bearing slides (soft-close or regular) for smooth kitchen drawer movement.',
    visitingFee: 199,
    estimatedLabor: 190,
    estDurationMinutes: 40,
    badge: 'Modular Fix',
    keywords: ['drawer', 'channel', 'telescopic', 'runner', 'modular kitchen', 'hettich', 'ebco', 'soft close'],
    emergencyAvailable: false
  },
  {
    id: 'work-door-planer-latch',
    categoryId: 'carpentry',
    categoryTitle: 'Carpentry & Furniture',
    title: 'Door Sticking Planer & Aldrop Latch Fitting',
    description: 'Plane swollen wooden doors hitting floor/frame, fit brass/SS aldrop, tower bolts, door stopper & hinge adjustment.',
    visitingFee: 199,
    estimatedLabor: 180,
    estDurationMinutes: 40,
    badge: 'Door Doctor',
    keywords: ['door', 'planer', 'sticking', 'latch', 'aldrop', 'hinge', 'tower bolt', 'door stopper'],
    emergencyAvailable: false
  },
  {
    id: 'work-furniture-assembly',
    categoryId: 'carpentry',
    categoryTitle: 'Carpentry & Furniture',
    title: 'Flatpack Furniture Assembly (IKEA / Online)',
    description: 'Expert assembly of multi-tier bookcases, study tables, TV consoles, dining sets and shoe racks with warranty.',
    visitingFee: 199,
    estimatedLabor: 320,
    estDurationMinutes: 60,
    badge: 'Precision Build',
    keywords: ['ikea', 'assembly', 'furniture', 'urban ladder', 'pepperfry', 'study table', 'shoe rack', 'bookcase'],
    emergencyAvailable: false
  },
  {
    id: 'work-drill-wall-mount',
    categoryId: 'carpentry',
    categoryTitle: 'Carpentry & Furniture',
    title: 'Drill Hole & Wall Mounting (TV, Mirror, Shelves)',
    description: 'Precision drill holes with rawl plugs for heavy wall mirrors, LED TVs, floating shelves, art frames and clocks.',
    visitingFee: 199,
    estimatedLabor: 160,
    estDurationMinutes: 30,
    badge: 'No Mess Drill',
    keywords: ['drill', 'wall mount', 'mirror', 'tv mount', 'shelf', 'photo frame', 'curtain rod'],
    emergencyAvailable: false
  },

  // Deep Cleaning & Pest Control
  {
    id: 'work-bathroom-deep-clean',
    categoryId: 'cleaning',
    categoryTitle: 'Deep Home Cleaning',
    title: 'Bathroom Hard Water Scale & Deep Scrub',
    description: 'Heavy duty descaling of hard water minerals on tiles, taps, shower partition glass, exhaust and WC seat.',
    visitingFee: 199,
    estimatedLabor: 349,
    estDurationMinutes: 60,
    badge: 'Sparkling Clean',
    keywords: ['bathroom', 'washroom', 'toilet', 'hard water', 'scale', 'tiles', 'stain', 'scrubbing'],
    emergencyAvailable: false
  },
  {
    id: 'work-sofa-shampoo',
    categoryId: 'cleaning',
    categoryTitle: 'Deep Home Cleaning',
    title: 'Sofa & Upholstery Foam Shampoo Wash',
    description: 'Dry foam injection and deep vacuum extraction to remove dust mites, sweat stains, and food spills from fabric sofas.',
    visitingFee: 199,
    estimatedLabor: 499,
    estDurationMinutes: 60,
    badge: 'Fabric Care',
    keywords: ['sofa', 'couch', 'upholstery', 'shampoo', 'fabric', 'vacuum', 'stain removal', 'cushion'],
    emergencyAvailable: false
  },
  {
    id: 'work-full-home-deep-clean',
    categoryId: 'cleaning',
    categoryTitle: 'Deep Home Cleaning',
    title: 'Full Home Deep Sanitization (1/2/3 BHK)',
    description: 'Complete floor machine buffing, kitchen degreasing, bathroom descaling, cobweb removal, windows & balconies.',
    visitingFee: 199,
    estimatedLabor: 999,
    estDurationMinutes: 180,
    badge: 'Move-in Special',
    keywords: ['full house', 'deep cleaning', 'home cleaning', '1bhk', '2bhk', '3bhk', 'move in', 'tenancy'],
    emergencyAvailable: false
  },
  {
    id: 'work-cockroach-pest',
    categoryId: 'pest_control',
    categoryTitle: 'Pest Control & Termite',
    title: 'Cockroach Herbal Gel & Odorless Kitchen Defense',
    description: 'Advanced Bayer gel dots in cabinets, hinges and sink crevices plus perimeter repellent spray with 90-day warranty.',
    visitingFee: 199,
    estimatedLabor: 399,
    estDurationMinutes: 45,
    badge: 'Odorless',
    keywords: ['cockroach', 'pest control', 'bugs', 'herbal gel', 'kitchen pest', 'ants', 'bayer'],
    emergencyAvailable: false
  },
  {
    id: 'work-termite-treatment',
    categoryId: 'pest_control',
    categoryTitle: 'Pest Control & Termite',
    title: 'Anti-Termite Drilling & Chemical Barrier Injection',
    description: 'Precision drill holes at 1-foot intervals along skirting, high-pressure termiticide injection & matching cement seal.',
    visitingFee: 199,
    estimatedLabor: 699,
    estDurationMinutes: 90,
    badge: '1-Year Warranty',
    keywords: ['termite', 'deemak', 'wood borer', 'anti termite', 'drilling', 'wood protection'],
    emergencyAvailable: false
  },
  {
    id: 'work-pigeon-net',
    categoryId: 'pest_control',
    categoryTitle: 'Pest Control & Termite',
    title: 'Balcony Pigeon Safety Net Installation',
    description: 'UV-stabilized garware nylon net with stainless steel wire frame and heavy anchors to keep pigeons off balconies.',
    visitingFee: 199,
    estimatedLabor: 499,
    estDurationMinutes: 60,
    badge: 'Clean Balcony',
    keywords: ['pigeon', 'bird net', 'pigeon net', 'balcony net', 'safety net', 'bird droppings'],
    emergencyAvailable: false
  },

  // Locksmith & Security
  {
    id: 'work-lockout-emergency',
    categoryId: 'locksmith',
    categoryTitle: 'Locksmith & Smart Locks',
    title: 'Emergency House Lockout Door Opening',
    description: 'Non-destructive latch bypass and pick opening for jammed doors, locked-out residents or lost keys.',
    visitingFee: 199,
    estimatedLabor: 299,
    estDurationMinutes: 25,
    badge: 'Immediate SOS',
    keywords: ['locked out', 'locksmith', 'door lock', 'jammed lock', 'lost key', 'open door', 'emergency'],
    emergencyAvailable: true
  },
  {
    id: 'work-godrej-lock-change',
    categoryId: 'locksmith',
    categoryTitle: 'Locksmith & Smart Locks',
    title: 'Godrej / Yale Main Door Lock Replacement',
    description: 'Fit new double-cylinder mortise lock, rim deadbolt, or high-security Euro profile cylinder with computer keys.',
    visitingFee: 199,
    estimatedLabor: 260,
    estDurationMinutes: 45,
    badge: 'High Security',
    keywords: ['godrej', 'yale', 'lock replacement', 'deadbolt', 'cylinder', 'keys', 'mortise lock'],
    emergencyAvailable: false
  },
  {
    id: 'work-smart-biometric-lock',
    categoryId: 'locksmith',
    categoryTitle: 'Locksmith & Smart Locks',
    title: 'Smart Biometric Fingerprint & WiFi Lock Install',
    description: 'Mortise door cut-out, installation of digital smart locks (Lavna, Yale, Ozone, Philips), app sync & passcode setup.',
    visitingFee: 199,
    estimatedLabor: 499,
    estDurationMinutes: 75,
    badge: 'Smart Home',
    keywords: ['smart lock', 'biometric', 'fingerprint', 'digital lock', 'wifi lock', 'lavna', 'keyless'],
    emergencyAvailable: false
  },

  // Painting & Waterproofing
  {
    id: 'work-damp-wall-waterproof',
    categoryId: 'painting',
    categoryTitle: 'Painting & Damp Wall Treatment',
    title: 'Damp Wall Seepage Treatment & Waterproofing',
    description: 'Scrape flaking paint, apply crystalline water-barrier sealer, acrylic crack paste and anti-efflorescence primer.',
    visitingFee: 199,
    estimatedLabor: 380,
    estDurationMinutes: 60,
    badge: 'Damp Proof',
    keywords: ['dampness', 'seepage', 'efflorescence', 'waterproofing', 'dr fixit', 'wall peel', 'moisture'],
    emergencyAvailable: false
  },
  {
    id: 'work-room-repainting',
    categoryId: 'painting',
    categoryTitle: 'Painting & Damp Wall Treatment',
    title: 'Single Room Repainting (Royale / Premium Emulsion)',
    description: 'Putty patching, floor covering with drop sheets, two coats of Asian Paints Royale or Tractor emulsion.',
    visitingFee: 199,
    estimatedLabor: 650,
    estDurationMinutes: 120,
    badge: 'Fresh Look',
    keywords: ['painting', 'asian paints', 'royale', 'emulsion', 'room paint', 'painter', 'whitewash'],
    emergencyAvailable: false
  },

  // CCTV & Smart Home
  {
    id: 'work-cctv-install',
    categoryId: 'cctv_smart_home',
    categoryTitle: 'CCTV & Smart Home Security',
    title: 'CCTV Security Camera & DVR Installation',
    description: 'Mount dome/bullet cameras, run RG59/Cat6 cabling, configure DVR hard disk and set up live mobile viewing app.',
    visitingFee: 199,
    estimatedLabor: 399,
    estDurationMinutes: 60,
    badge: 'Safe Guard',
    keywords: ['cctv', 'camera', 'security camera', 'dvr', 'hikvision', 'cp plus', 'surveillance', 'mobile view'],
    emergencyAvailable: false
  },
  {
    id: 'work-smart-doorbell',
    categoryId: 'cctv_smart_home',
    categoryTitle: 'CCTV & Smart Home Security',
    title: 'Smart Video Doorbell Setup (Qubo / Ring / Xiaomi)',
    description: 'Wall drill bracket, connect 12V chime wiring or battery setup, pair with home 2.4GHz WiFi and test 2-way talk.',
    visitingFee: 199,
    estimatedLabor: 220,
    estDurationMinutes: 35,
    badge: 'Smart Entry',
    keywords: ['video doorbell', 'smart bell', 'qubo', 'ring', 'door camera', 'smart home'],
    emergencyAvailable: false
  },

  // Masonry & Tile Repair
  {
    id: 'work-tile-replacement',
    categoryId: 'masonry_tiling',
    categoryTitle: 'Masonry & Tile Repair',
    title: 'Broken Floor or Bathroom Tile Replacement',
    description: 'Chip out damaged tile without cracking adjacent slabs, level with tile adhesive mortar and finish with matching grout.',
    visitingFee: 199,
    estimatedLabor: 280,
    estDurationMinutes: 50,
    badge: 'Precision Tile',
    keywords: ['tile', 'broken tile', 'floor tile', 'bathroom tile', 'grouting', 'tile fix', 'mason'],
    emergencyAvailable: false
  },
  {
    id: 'work-epoxy-grout',
    categoryId: 'masonry_tiling',
    categoryTitle: 'Masonry & Tile Repair',
    title: 'Bathroom Tile Epoxy Grouting for Leak Prevention',
    description: 'Rake out dirty/eroded cement grout, apply chemical epoxy resin grout to permanently stop water leaking to floor below.',
    visitingFee: 199,
    estimatedLabor: 420,
    estDurationMinutes: 60,
    badge: '100% Water Block',
    keywords: ['epoxy', 'grout', 'tile joints', 'leak prevention', 'waterproof floor', 'bathroom seepage'],
    emergencyAvailable: false
  }
];

export const TIME_SLOTS = [
  { id: 'asap', label: '⚡ ASAP Delivery (Next available pro in ~20-35 mins)', isAsap: true },
  { id: 'morning_1', label: '08:00 AM - 10:00 AM (Early Morning)' },
  { id: 'morning_2', label: '10:00 AM - 12:00 PM (Late Morning)' },
  { id: 'afternoon_1', label: '12:00 PM - 02:00 PM (Midday)' },
  { id: 'afternoon_2', label: '02:00 PM - 04:00 PM (Afternoon)' },
  { id: 'evening_1', label: '04:00 PM - 06:00 PM (Early Evening)' },
  { id: 'evening_2', label: '06:00 PM - 08:00 PM (Night Slot)' }
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'w-carlos',
    name: 'Ramesh Kumar',
    phone: '+91 98450 12345',
    email: 'ramesh.plumber@fixmate.in',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewCount: 342,
    completedJobs: 418,
    categories: ['plumbing', 'appliances'],
    hourlyRate: 399,
    status: 'available',
    location: {
      lat: 12.9784,
      lng: 77.6408,
      address: '100ft Road, Indiranagar, Bengaluru'
    },
    vehicle: {
      type: 'Van',
      model: 'Maruti Suzuki Eeco (White)',
      plateNumber: 'KA-03-MK-4821'
    },
    badges: ['FixMate Elite Partner', 'Aadhaar Verified', '100% On-Time in Bengaluru'],
    experienceYears: 12,
    about: 'Master licensed plumber with 12+ years in Bengaluru handling pipeline bursts, diverters, motor pumps, and tank fittings. Always carry a complete tool kit.'
  },
  {
    id: 'w-maya',
    name: 'Priya Sharma',
    phone: '+91 98450 54321',
    email: 'priya.electrical@fixmate.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviewCount: 289,
    completedJobs: 330,
    categories: ['electrical', 'appliances', 'locksmith'],
    hourlyRate: 449,
    status: 'available',
    location: {
      lat: 12.9352,
      lng: 77.6245,
      address: '5th Block, Koramangala, Bengaluru'
    },
    vehicle: {
      type: 'Truck',
      model: 'Tata Ace Mini (Navy Blue)',
      plateNumber: 'KA-01-EA-1930'
    },
    badges: ['Govt Certified Wireman', 'Smart Home Specialist', 'Zero-Harm Safety'],
    experienceYears: 9,
    about: 'Certified electrical technician specializing in short circuits, MCB panel upgrades, inverter wiring, and smart biometric locks.'
  },
  {
    id: 'w-marcus',
    name: 'Suresh Patel',
    phone: '+91 98450 67890',
    email: 'suresh.carpenter@fixmate.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.89,
    reviewCount: 195,
    completedJobs: 240,
    categories: ['carpentry', 'painting'],
    hourlyRate: 349,
    status: 'available',
    location: {
      lat: 12.9121,
      lng: 77.6446,
      address: 'Sector 2, HSR Layout, Bengaluru'
    },
    vehicle: {
      type: 'Van',
      model: 'Mahindra Bolero Maxi (Silver)',
      plateNumber: 'KA-51-AB-2319'
    },
    badges: ['Master Woodcrafter', 'Furniture Specialist', 'Fast Delivery'],
    experienceYears: 8,
    about: 'Skilled carpenter with fast modular wardrobe repair, bed hydraulic fixes, door alignment, and precision TV wall installation.'
  },
  {
    id: 'w-elena',
    name: 'Sunita Devi',
    phone: '+91 98450 99887',
    email: 'sunita.cleaning@fixmate.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 4.93,
    reviewCount: 410,
    completedJobs: 560,
    categories: ['cleaning', 'painting'],
    hourlyRate: 320,
    status: 'available',
    location: {
      lat: 12.9756,
      lng: 77.6066,
      address: 'MG Road, Central Bengaluru'
    },
    vehicle: {
      type: 'Van',
      model: 'Omni Utility Van (Grey)',
      plateNumber: 'KA-04-EL-9014'
    },
    badges: ['Hospital Grade Sanitization', 'Green Seal Certified', 'Top Rated'],
    experienceYears: 8,
    about: 'Deep cleaning expert equipped with high-pressure steam extraction and non-toxic sanitization products for homes, flats, and offices.'
  }
];

export const DEMO_CUSTOMER: User = {
  id: 'cust-arpitha',
  name: 'Sai Arpitha',
  email: 'kandalamsaiarpitha@gmail.com',
  phone: '+91 98123 45678',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  role: 'customer',
  address: 'Flat 402, Prestige Acropolis, 20th Main Rd, 5th Block, Koramangala, Bengaluru, Karnataka 560034',
  location: {
    lat: 12.9352,
    lng: 77.6245
  },
  authProvider: 'phone'
};

export const INITIAL_JOBS: JobRequest[] = [
  {
    id: 'job-9842',
    customerId: 'cust-arpitha',
    customerName: 'Sai Arpitha',
    customerPhone: '+91 98123 45678',
    customerAddress: 'Flat 402, Prestige Acropolis, Koramangala, Bengaluru',
    customerLocation: {
      lat: 12.9352,
      lng: 77.6245
    },
    unitNotes: 'Tower B, 4th Floor. Intercom #402. Security gate pass available.',
    categoryId: 'plumbing',
    serviceTitle: 'Plumbing & Pipes',
    description: 'Under-sink hot water connection line has a continuous drip onto the wooden cabinetry. Needs urgent gasket replacement.',
    selectedIssues: ['Burst or dripping pipe'],
    urgency: 'emergency_30min',
    scheduledDate: '2026-09-29',
    timeSlot: '⚡ ASAP Delivery (Next available pro in ~20-35 mins)',
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80'
    ],
    estimatedTotal: 330,
    status: 'en_route',
    assignedWorkerId: 'w-carlos',
    workerLocation: {
      lat: 12.9520,
      lng: 77.6320
    },
    etaMinutes: 11,
    createdAt: Date.now() - 1000 * 60 * 18,
    acceptedAt: Date.now() - 1000 * 60 * 14,
    invoice: {
      visitingCharge: 99,
      workLaborCharge: 180,
      distanceKm: 2.4,
      distanceCharge: 36, // 2.4 km @ ₹15/km
      serviceFee: 99,
      materialsFee: 0,
      platformFee: 0,
      discount: 0,
      tax: 15,
      tip: 0,
      total: 330
    }
  }
];
