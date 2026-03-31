const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@cravingggg.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999',
    });

    // Create test user
    const testUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      phone: '9876543210',
      address: {
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
      },
    });

    console.log('👤 Users created');

    // Create restaurants
    const restaurants = await Restaurant.create([
      {
        name: 'Burger King',
        description: 'Home of the Whopper. Famous for flame-grilled burgers and crispy fries.',
        cuisine: ['American', 'Fast Food', 'Burgers'],
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
        rating: 4.2,
        totalRatings: 1250,
        deliveryTime: '25-35 min',
        deliveryFee: 30,
        minOrder: 149,
        address: { street: 'Linking Road', city: 'Mumbai', zipCode: '400050' },
        isOpen: true,
        isVeg: false,
        featured: true,
        tags: ['burgers', 'fast food', 'fries', 'shakes'],
      },
      {
        name: 'Pizza Paradise',
        description: 'Authentic Italian pizzas with a modern twist. Wood-fired and delicious.',
        cuisine: ['Italian', 'Pizza', 'Fast Food'],
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        rating: 4.5,
        totalRatings: 2300,
        deliveryTime: '30-40 min',
        deliveryFee: 40,
        minOrder: 199,
        address: { street: 'Andheri West', city: 'Mumbai', zipCode: '400058' },
        isOpen: true,
        isVeg: false,
        featured: true,
        tags: ['pizza', 'italian', 'pasta', 'garlic bread'],
      },
      {
        name: 'Spice Garden',
        description: 'Traditional North Indian cuisine with rich, aromatic spices and flavors.',
        cuisine: ['North Indian', 'Mughlai', 'Biryani'],
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
        rating: 4.4,
        totalRatings: 3100,
        deliveryTime: '35-45 min',
        deliveryFee: 35,
        minOrder: 200,
        address: { street: 'Colaba', city: 'Mumbai', zipCode: '400005' },
        isOpen: true,
        isVeg: false,
        featured: true,
        tags: ['biryani', 'butter chicken', 'naan', 'mughlai'],
      },
      {
        name: 'Green Leaf',
        description: 'Pure vegetarian restaurant serving healthy and delicious South Indian food.',
        cuisine: ['South Indian', 'Vegetarian', 'Healthy'],
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800',
        rating: 4.3,
        totalRatings: 1800,
        deliveryTime: '20-30 min',
        deliveryFee: 25,
        minOrder: 100,
        address: { street: 'Dadar', city: 'Mumbai', zipCode: '400014' },
        isOpen: true,
        isVeg: true,
        featured: true,
        tags: ['dosa', 'idli', 'vada', 'south indian', 'vegetarian'],
      },
      {
        name: 'Dragon Wok',
        description: 'Authentic Chinese and Pan-Asian cuisine. From dim sum to sizzling woks.',
        cuisine: ['Chinese', 'Asian', 'Thai'],
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        rating: 4.1,
        totalRatings: 950,
        deliveryTime: '30-40 min',
        deliveryFee: 45,
        minOrder: 250,
        address: { street: 'Bandra', city: 'Mumbai', zipCode: '400050' },
        isOpen: true,
        isVeg: false,
        featured: true,
        tags: ['chinese', 'noodles', 'manchurian', 'dim sum'],
      },
      {
        name: 'Sweet Tooth',
        description: 'Premium desserts and bakery items. Cakes, pastries, ice cream, and more.',
        cuisine: ['Desserts', 'Bakery', 'Ice Cream'],
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
        rating: 4.6,
        totalRatings: 2700,
        deliveryTime: '20-25 min',
        deliveryFee: 20,
        minOrder: 150,
        address: { street: 'Juhu', city: 'Mumbai', zipCode: '400049' },
        isOpen: true,
        isVeg: true,
        featured: true,
        tags: ['desserts', 'cakes', 'ice cream', 'pastries'],
      },
      {
        name: 'Tandoori Nights',
        description: 'Smoky tandoori dishes, succulent kebabs, and refreshing Indian breads.',
        cuisine: ['North Indian', 'Tandoor', 'Kebabs'],
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
        rating: 4.3,
        totalRatings: 1400,
        deliveryTime: '35-45 min',
        deliveryFee: 35,
        minOrder: 200,
        address: { street: 'Lower Parel', city: 'Mumbai', zipCode: '400013' },
        isOpen: true,
        isVeg: false,
        featured: false,
        tags: ['tandoori', 'kebabs', 'naan', 'tikka'],
      },
      {
        name: 'Wrap & Roll',
        description: 'Fresh wraps, shawarmas, and rolls. Quick, tasty, and on the go.',
        cuisine: ['Fast Food', 'Middle Eastern', 'Street Food'],
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
        rating: 4.0,
        totalRatings: 780,
        deliveryTime: '15-25 min',
        deliveryFee: 20,
        minOrder: 100,
        address: { street: 'Powai', city: 'Mumbai', zipCode: '400076' },
        isOpen: true,
        isVeg: false,
        featured: false,
        tags: ['wraps', 'shawarma', 'rolls', 'fast food'],
      },
    ]);

    console.log('🍽️  Restaurants created');

    // Create food items for each restaurant
    const foodItems = [
      // Burger King items
      { name: 'Whopper Burger', description: 'Signature flame-grilled beef burger with fresh lettuce, tomato, and onion', price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'burger', restaurant: restaurants[0]._id, isVeg: false, isBestseller: true, rating: 4.5 },
      { name: 'Chicken Royale', description: 'Crispy chicken patty with mayo, lettuce, and tomato', price: 179, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', category: 'burger', restaurant: restaurants[0]._id, isVeg: false, isBestseller: true, rating: 4.3 },
      { name: 'Veg Whopper', description: 'Plant-based patty with all the classic Whopper toppings', price: 169, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', category: 'burger', restaurant: restaurants[0]._id, isVeg: true, isBestseller: false, rating: 4.0 },
      { name: 'Crispy Fries (Large)', description: 'Golden crispy french fries seasoned to perfection', price: 99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', category: 'fast-food', restaurant: restaurants[0]._id, isVeg: true, isBestseller: false, rating: 4.2 },
      { name: 'Chicken Nuggets (6pc)', description: 'Tender chicken nuggets with dipping sauce', price: 149, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', category: 'starters', restaurant: restaurants[0]._id, isVeg: false, isBestseller: false, rating: 4.1 },
      { name: 'Chocolate Shake', description: 'Rich and creamy chocolate milkshake', price: 129, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', category: 'beverages', restaurant: restaurants[0]._id, isVeg: true, isBestseller: false, rating: 4.4 },

      // Pizza Paradise items
      { name: 'Margherita Pizza', description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil', price: 249, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category: 'pizza', restaurant: restaurants[1]._id, isVeg: true, isBestseller: true, rating: 4.6 },
      { name: 'Pepperoni Supreme', description: 'Loaded with pepperoni, mozzarella, and Italian herbs', price: 349, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category: 'pizza', restaurant: restaurants[1]._id, isVeg: false, isBestseller: true, rating: 4.7 },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ chicken with red onions and jalapeños', price: 329, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category: 'pizza', restaurant: restaurants[1]._id, isVeg: false, isBestseller: false, rating: 4.4 },
      { name: 'Garlic Bread', description: 'Freshly baked garlic bread with herbs and butter', price: 129, image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', category: 'starters', restaurant: restaurants[1]._id, isVeg: true, isBestseller: false, rating: 4.3 },
      { name: 'Pasta Alfredo', description: 'Creamy Alfredo pasta with parmesan and mushrooms', price: 229, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', category: 'main-course', restaurant: restaurants[1]._id, isVeg: true, isBestseller: false, rating: 4.2 },
      { name: 'Tiramisu', description: 'Classic Italian coffee-flavored layered dessert', price: 199, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category: 'desserts', restaurant: restaurants[1]._id, isVeg: true, isBestseller: false, rating: 4.5 },

      // Spice Garden items
      { name: 'Hyderabadi Biryani', description: 'Aromatic basmati rice layered with tender chicken and spices', price: 299, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', category: 'biryani', restaurant: restaurants[2]._id, isVeg: false, isBestseller: true, rating: 4.8 },
      { name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken pieces', price: 279, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', category: 'main-course', restaurant: restaurants[2]._id, isVeg: false, isBestseller: true, rating: 4.7 },
      { name: 'Paneer Tikka Masala', description: 'Grilled paneer in a rich, spicy tomato gravy', price: 249, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: 'main-course', restaurant: restaurants[2]._id, isVeg: true, isBestseller: true, rating: 4.5 },
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils in a buttery, creamy gravy', price: 199, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'main-course', restaurant: restaurants[2]._id, isVeg: true, isBestseller: false, rating: 4.4 },
      { name: 'Garlic Naan', description: 'Soft, fluffy naan bread with garlic and butter', price: 59, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', category: 'main-course', restaurant: restaurants[2]._id, isVeg: true, isBestseller: false, rating: 4.3 },
      { name: 'Gulab Jamun', description: 'Soft, deep-fried milk dumplings in sweet syrup', price: 99, image: 'https://images.unsplash.com/photo-1666190050431-e9e0a1bf5039?w=400', category: 'desserts', restaurant: restaurants[2]._id, isVeg: true, isBestseller: false, rating: 4.6 },

      // Green Leaf items
      { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato filling', price: 129, image: 'https://images.unsplash.com/photo-1668236543090-82eb5eab6fee?w=400', category: 'south-indian', restaurant: restaurants[3]._id, isVeg: true, isBestseller: true, rating: 4.5 },
      { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup and chutneys', price: 99, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', category: 'south-indian', restaurant: restaurants[3]._id, isVeg: true, isBestseller: true, rating: 4.3 },
      { name: 'Veg Thali', description: 'Complete meal with rice, dal, sabzi, roti, salad, and dessert', price: 199, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'main-course', restaurant: restaurants[3]._id, isVeg: true, isBestseller: false, rating: 4.4 },
      { name: 'Medu Vada', description: 'Crispy fried lentil donuts served with sambar and chutney', price: 79, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', category: 'south-indian', restaurant: restaurants[3]._id, isVeg: true, isBestseller: false, rating: 4.2 },
      { name: 'Filter Coffee', description: 'Traditional South Indian filter coffee', price: 49, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', category: 'beverages', restaurant: restaurants[3]._id, isVeg: true, isBestseller: false, rating: 4.6 },

      // Dragon Wok items
      { name: 'Chicken Manchurian', description: 'Deep-fried chicken in a spicy, tangy Manchurian sauce', price: 249, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', category: 'chinese', restaurant: restaurants[4]._id, isVeg: false, isBestseller: true, rating: 4.3 },
      { name: 'Veg Hakka Noodles', description: 'Stir-fried noodles with mixed vegetables and soy sauce', price: 179, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', category: 'chinese', restaurant: restaurants[4]._id, isVeg: true, isBestseller: true, rating: 4.2 },
      { name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken, eggs, and vegetables', price: 199, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', category: 'chinese', restaurant: restaurants[4]._id, isVeg: false, isBestseller: false, rating: 4.1 },
      { name: 'Spring Rolls (6pc)', description: 'Crispy rolls stuffed with vegetables, served with sweet chili sauce', price: 149, image: 'https://images.unsplash.com/photo-1548507200-d4e5a5206f27?w=400', category: 'starters', restaurant: restaurants[4]._id, isVeg: true, isBestseller: false, rating: 4.0 },
      { name: 'Hot & Sour Soup', description: 'Spicy and tangy soup with tofu, mushrooms, and bamboo shoots', price: 129, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', category: 'starters', restaurant: restaurants[4]._id, isVeg: true, isBestseller: false, rating: 4.1 },

      // Sweet Tooth items
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a gooey molten center', price: 199, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', category: 'desserts', restaurant: restaurants[5]._id, isVeg: true, isBestseller: true, rating: 4.8 },
      { name: 'New York Cheesecake', description: 'Creamy, classic cheesecake with berry compote', price: 249, image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400', category: 'desserts', restaurant: restaurants[5]._id, isVeg: true, isBestseller: true, rating: 4.7 },
      { name: 'Brownie Sundae', description: 'Warm brownie topped with vanilla ice cream and chocolate sauce', price: 179, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', category: 'desserts', restaurant: restaurants[5]._id, isVeg: true, isBestseller: false, rating: 4.5 },
      { name: 'Mango Smoothie', description: 'Thick and refreshing mango smoothie with real mango pulp', price: 149, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', category: 'beverages', restaurant: restaurants[5]._id, isVeg: true, isBestseller: false, rating: 4.4 },
      { name: 'Red Velvet Cupcake', description: 'Soft red velvet cupcake with cream cheese frosting', price: 129, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400', category: 'desserts', restaurant: restaurants[5]._id, isVeg: true, isBestseller: false, rating: 4.3 },

      // Tandoori Nights items
      { name: 'Tandoori Chicken', description: 'Whole chicken marinated in yogurt and spices, cooked in tandoor', price: 329, image: 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400', category: 'main-course', restaurant: restaurants[6]._id, isVeg: false, isBestseller: true, rating: 4.6 },
      { name: 'Seekh Kebab', description: 'Minced lamb kebabs seasoned with aromatic spices', price: 249, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', category: 'starters', restaurant: restaurants[6]._id, isVeg: false, isBestseller: true, rating: 4.5 },
      { name: 'Paneer Tikka', description: 'Marinated paneer cubes grilled to perfection in tandoor', price: 199, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', category: 'starters', restaurant: restaurants[6]._id, isVeg: true, isBestseller: false, rating: 4.3 },
      { name: 'Chicken Tikka Biryani', description: 'Fragrant biryani with tikka-marinated chicken', price: 319, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', category: 'biryani', restaurant: restaurants[6]._id, isVeg: false, isBestseller: false, rating: 4.4 },

      // Wrap & Roll items
      { name: 'Chicken Shawarma', description: 'Juicy chicken wrapped in pita with garlic sauce and pickles', price: 149, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', category: 'fast-food', restaurant: restaurants[7]._id, isVeg: false, isBestseller: true, rating: 4.3 },
      { name: 'Paneer Wrap', description: 'Grilled paneer with mint chutney and fresh veggies in a wrap', price: 129, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', category: 'fast-food', restaurant: restaurants[7]._id, isVeg: true, isBestseller: true, rating: 4.2 },
      { name: 'Falafel Roll', description: 'Crispy falafel with hummus, tahini, and salad in a roll', price: 139, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400', category: 'fast-food', restaurant: restaurants[7]._id, isVeg: true, isBestseller: false, rating: 4.1 },
      { name: 'Loaded Nachos', description: 'Tortilla chips with cheese, jalapeños, salsa, and sour cream', price: 169, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', category: 'starters', restaurant: restaurants[7]._id, isVeg: true, isBestseller: false, rating: 4.0 },
    ];

    await FoodItem.create(foodItems);
    console.log('🍕 Food items created');

    console.log('🚀 Generating 50 additional restaurants and 100 items per restaurant (5000 total items)...');
    
    const restaurantImages = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'
    ];
    
    const foodImages = [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      'https://images.unsplash.com/photo-1668236543090-82eb5eab6fee?w=400',
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
      'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
      'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400',
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400'
    ];

    const extraRestaurantsData = [];
    const cuisines = ['Italian', 'Chinese', 'North Indian', 'Mexican', 'American', 'Thai', 'Japanese', 'South Indian', 'Continental'];
    
    for (let i = 1; i <= 50; i++) {
      extraRestaurantsData.push({
        name: `Amazing Cuisine Hub ${i}`,
        description: `Experience the best flavors at our newest location #${i}. Serving freshly cooked premium food.`,
        cuisine: [cuisines[i % cuisines.length], 'Fast Food'],
        image: restaurantImages[i % restaurantImages.length],
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        totalRatings: Math.floor(Math.random() * 2000) + 50,
        deliveryTime: `${20 + (i % 3) * 10}-${30 + (i % 3) * 10} min`,
        deliveryFee: 20 + (i % 5) * 10,
        minOrder: 100 + (i % 4) * 50,
        address: { street: `Food Avenue ${i}`, city: 'Mumbai', zipCode: `4000${(i % 90) + 10}` },
        isOpen: true,
        isVeg: i % 4 === 0,
        featured: i % 10 === 0,
        tags: ['delicious', 'fresh', 'premium'],
      });
    }

    const insertedExtraRestaurants = await Restaurant.create(extraRestaurantsData);
    console.log('🍽️  50 Extra Restaurants created');

    const categories = ['pizza', 'burger', 'biryani', 'chinese', 'desserts', 'south-indian', 'fast-food', 'beverages', 'main-course', 'starters'];
    const extraFoodItems = [];

    insertedExtraRestaurants.forEach((restaurant, rIndex) => {
      for (let j = 1; j <= 100; j++) {
        extraFoodItems.push({
          name: `${restaurant.cuisine[0]} Delight ${j}`,
          description: `A delicious and amazing item number ${j} from our chef's special menu at ${restaurant.name}.`,
          price: 99 + Math.floor(Math.random() * 400),
          image: foodImages[(rIndex + j) % foodImages.length],
          category: categories[j % categories.length],
          restaurant: restaurant._id,
          isVeg: restaurant.isVeg ? true : (j % 3 === 0),
          isBestseller: j % 20 === 0,
          rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
        });
      }
    });

    // Insert food items in chunks to avoid memory/timeout issues
    const chunkSize = 1000;
    for (let i = 0; i < extraFoodItems.length; i += chunkSize) {
      await FoodItem.create(extraFoodItems.slice(i, i + chunkSize));
    }
    console.log(`🍕 ${extraFoodItems.length} Extra Food items created`);

    console.log('\n✅ Seed data inserted successfully!');
    console.log('\n📧 Admin Login: admin@cravingggg.com / admin123');
    console.log('📧 User Login: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
