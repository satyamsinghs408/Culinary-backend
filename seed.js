const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const RawMaterial = require('./models/RawMaterial');
const FinishedGood = require('./models/FinishedGood');

dotenv.config();

// --- INITIAL DATA FROM STORE.JSX ---

const INITIAL_USERS = [
  { name: 'John Doe', username: 'john', mobile: '9876543210', email: 'john@example.com', password: 'password123', role: 'user' },
  { name: 'Jane Smith', username: 'jane', mobile: '9123456780', email: 'jane@test.com', password: 'password456', role: 'user' },
  { name: 'Admin User', username: 'admin', mobile: '9999999999', email: 'admin@crm.com', password: 'admin', role: 'admin' }
];

const INITIAL_RM = [
  { id: 1, name: 'Cashew (Kaju)', uom: 'kg' },
  { id: 2, name: 'Sugar', uom: 'kg' },
  { id: 3, name: 'Ghee', uom: 'kg' },
  { id: 4, name: 'Saffron (Kesar)', uom: 'gram' },
  { id: 5, name: 'Milk Solids (Mawa)', uom: 'kg' },
  { id: 6, name: 'Maida (Flour)', uom: 'kg' },
  { id: 7, name: 'Pistachio', uom: 'kg' },
  { id: 8, name: 'Cardamom', uom: 'gram' }
];

const INITIAL_STOCK = {
  1: { opening: 50, inward: 1000, issued: 250, allocated: 50 }, // Cashew
  2: { opening: 200, inward: 5000, issued: 1200, allocated: 200 }, // Sugar
  3: { opening: 40, inward: 500, issued: 100, allocated: 20 }, // Ghee
  4: { opening: 0.5, inward: 2, issued: 0.5, allocated: 0.1 }, // Saffron
  5: { opening: 10, inward: 200, issued: 50, allocated: 10 }, // Mawa
  6: { opening: 100, inward: 1000, issued: 300, allocated: 40 }, // Maida
  7: { opening: 20, inward: 300, issued: 80, allocated: 15 }, // Pistachio
  8: { opening: 2, inward: 10, issued: 2, allocated: 0.5 } // Cardamom
};

const INITIAL_FG = [
  { id: 1, name: 'Kaju Katli', category: 'Sweets', price: 800 },
  { id: 2, name: 'Rasgulla', category: 'Sweets', price: 300 },
  { id: 3, name: 'Gulab Jamun', category: 'Sweets', price: 320 },
  { id: 4, name: 'Mysore Pak', category: 'Sweets', price: 550 },
  { id: 5, name: 'Jalebi', category: 'Sweets', price: 280 }
];

const INITIAL_BOM = {
    1: [ // Kaju Katli
      { rmId: 1, qty: 0.800, uom: 'kg' }, // Cashew
      { rmId: 2, qty: 0.400, uom: 'kg' }, // Sugar
      { rmId: 3, qty: 0.050, uom: 'kg' }  // Ghee
    ],
    2: [ // Rasgulla
      { rmId: 5, qty: 0.500, uom: 'kg' }, // Mawa
      { rmId: 2, qty: 0.600, uom: 'kg' }, // Sugar (Syrup)
      { rmId: 8, qty: 2.000, uom: 'gram' } // Cardamom
    ],
    3: [ // Gulab Jamun
      { rmId: 5, qty: 0.800, uom: 'kg' },
      { rmId: 6, qty: 0.200, uom: 'kg' },
      { rmId: 3, qty: 1.000, uom: 'kg' } // Frying
    ],
    4: [ // Mysore Pak
      { rmId: 6, qty: 0.500, uom: 'kg' }, // Besan
      { rmId: 3, qty: 1.500, uom: 'kg' }, // Lots of Ghee
      { rmId: 2, qty: 1.000, uom: 'kg' }
    ],
    5: [ // Jalebi
      { rmId: 6, qty: 1.000, uom: 'kg' },
      { rmId: 4, qty: 0.500, uom: 'gram' },
      { rmId: 2, qty: 2.000, uom: 'kg' }
    ]
  };

// --- SEED FUNCTION ---

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for Seeding...');

    // 1. Clear Data
    await User.deleteMany({});
    await RawMaterial.deleteMany({});
    await FinishedGood.deleteMany({});
    console.log('🗑️  Cleared existing data.');

    // 2. Insert Users
    await User.insertMany(INITIAL_USERS);
    console.log('👤 Users Seeded.');

    // 3. Insert Raw Materials & Map IDs
    const rmMap = {}; // Old integer ID -> New Mongo ID
    
    for (const rm of INITIAL_RM) {
        const stock = INITIAL_STOCK[rm.id] || {};
        
        const newRM = new RawMaterial({
            name: rm.name,
            uom: rm.uom,
            stock: {
                opening: stock.opening || 0,
                minLevel: 0,
                inward: stock.inward || 0,
                issued: stock.issued || 0,
                allocated: stock.allocated || 0
            }
        });

        const savedRM = await newRM.save();
        rmMap[rm.id] = savedRM._id; // Map old ID to new ID
    }
    console.log('📦 Raw Materials Seeded.');

    // 4. Insert Finished Goods with Mapped BOM
    for (const fg of INITIAL_FG) {
        const oldBOM = INITIAL_BOM[fg.id] || [];
        
        // Map BOM ingredients to new RM IDs
        const mappedBOM = oldBOM.map(item => ({
            rmId: rmMap[item.rmId],
            qty: item.qty,
            uom: item.uom
        })).filter(item => item.rmId); // Filter out if RM not found (sanity check)

        const newFG = new FinishedGood({
            name: fg.name,
            category: fg.category,
            price: fg.price,
            bom: mappedBOM
        });

        await newFG.save();
    }
    console.log('🍬 Finished Goods & BOM Seeded.');

    console.log('🎉 Database Seeding Completed Successfully!');
    process.exit();

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
};

seedDatabase();
