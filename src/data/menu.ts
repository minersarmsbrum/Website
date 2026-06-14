// FULL MENU — items & prices verbatim from miners-arms.com (do not alter).
// Organised into the two service menus the restaurant runs: Café + Pub.

export type Dish = {
  name: string;
  price: string;
  desc?: string;
  tags?: ("veg" | "spicy" | "signature" | "new")[];
};

export type MenuCategory = {
  id: string;
  title: string;
  blurb?: string;
  items: Dish[];
};

export type MenuSection = {
  id: string;
  title: string;
  kicker: string;
  categories: MenuCategory[];
};

export const menu: MenuSection[] = [
  {
    id: "pub",
    title: "The Pub Kitchen",
    kicker: "Lunch & Dinner",
    categories: [
      {
        id: "starters",
        title: "Starters",
        items: [
          { name: "Chicken Wings", price: "£6.50" },
          { name: "Sheesh Kebab", price: "£6.95" },
          { name: "Chicken Tikka", price: "£7.50", tags: ["signature"] },
          { name: "Achari Chicken Tikka", price: "£7.50" },
          { name: "Chicken Pakora", price: "£7.50" },
          { name: "Fish Pakora", price: "£7.50" },
          { name: "Chilli Fish", price: "£7.50", tags: ["spicy"] },
          { name: "Haryali Chicken Tikka", price: "£7.95" },
          { name: "Chicken Lollipop", price: "£8.00" },
          { name: "Chilli Chicken", price: "£8.50", tags: ["spicy"] },
          { name: "Spicy Pork Steak", price: "£8.95", tags: ["spicy"] },
          { name: "Chicken Malai Tikka", price: "£8.95" },
          { name: "Honey Chilli Chicken", price: "£8.95" },
          { name: "Fish Tikka", price: "£8.95" },
          { name: "Lamb Chops", price: "£9.95", tags: ["signature"] },
          { name: "Chilli King Prawn", price: "£10.95", tags: ["spicy"] },
          { name: "Tandoori King Prawn", price: "£11.95" },
          { name: "Salmon Tikka", price: "£12.95" },
        ],
      },
      {
        id: "veg-starters",
        title: "Vegetarian Starters",
        items: [
          { name: "Veg Spring Roll", price: "£3.50", tags: ["veg"] },
          { name: "Veg Samosa", price: "£3.50", tags: ["veg"] },
          { name: "Onion Bhaji", price: "£3.95", tags: ["veg"] },
          { name: "Chilli Paneer", price: "£7.95", tags: ["veg", "spicy"] },
          { name: "Veg Manchurian", price: "£7.95", tags: ["veg"] },
          { name: "Paneer Tikka", price: "£8.00", tags: ["veg"] },
          { name: "Veg Soya Tikka", price: "£8.95", tags: ["veg"] },
        ],
      },
      {
        id: "chefs-specials",
        title: "Chef's Specials: Curries",
        blurb: "Slow-cooked, spice-led, made fresh to order.",
        items: [
          { name: "Butter Chicken", price: "£8.95", desc: "Boneless chicken cooked in a creamy butter sauce", tags: ["signature"] },
          { name: "Chicken Madras", price: "£8.95", desc: "Chicken cooked with southern Indian style & hot sauce", tags: ["spicy"] },
          { name: "Chicken Jalfrezi", price: "£8.95", desc: "Chicken cooked with spices, onions & peppers" },
          { name: "Chicken Korma", price: "£8.95", desc: "Boneless chicken cooked with blended spices & coconut sauce" },
          { name: "Chicken Balti", price: "£8.95", desc: "Chicken pieces cooked with peppers, onions & traditional dal" },
          { name: "Chicken Curry", price: "£8.95" },
          { name: "Chicken Saag", price: "£8.95", desc: "Boneless chicken cooked with onions, tomatoes, spinach & spices" },
          { name: "Chicken Vindaloo", price: "£8.95", desc: "Boneless chicken cooked with herbs & spices", tags: ["spicy"] },
          { name: "Chicken Tikka Masala", price: "£8.95", desc: "Chicken tikka blended with spices in a rich & creamy sauce", tags: ["signature"] },
          { name: "Fish Curry", price: "£8.95", desc: "Cooked with spices in a rich & creamy sauce" },
          { name: "Lamb Balti", price: "£9.95", desc: "Boneless lamb cooked with onions, tomatoes, fresh spices & herbs" },
          { name: "Lamb Madras", price: "£9.95", desc: "Lamb cooked in a southern Indian style", tags: ["spicy"] },
          { name: "Lamb Jalfrezi", price: "£9.95", desc: "Diced lamb cooked with peppers & onions, hot", tags: ["spicy"] },
          { name: "Lamb Korma", price: "£9.95", desc: "Boneless lamb cooked in a mild coconut sauce" },
          { name: "Lamb Curry", price: "£9.95", desc: "Spicy lamb cooked with hot spices", tags: ["spicy"] },
          { name: "Lamb Bhuna", price: "£9.95", desc: "Boneless lamb cooked in a thick traditional Indian sauce" },
          { name: "Lamb Saag", price: "£9.95", desc: "Boneless lamb cooked with spinach & spices" },
          { name: "Lamb Masala", price: "£9.95", desc: "Boneless lamb cooked with onions, tomatoes, fresh spices & herbs" },
          { name: "Lamb Rogan Josh", price: "£9.95", desc: "Tender pieces of lamb cooked with Indian spices" },
          { name: "Keema Peas", price: "£9.95", desc: "Mutton keema cooked with onions, tomato, peas and spices" },
          { name: "Rara Gosht", price: "£10.50", desc: "Lamb combined with keema cooked in our chef's special sauce", tags: ["signature"] },
          { name: "Special Mix Curry", price: "£10.95", desc: "Lamb, chicken & prawns in a traditional curry sauce" },
          { name: "Goat Curry", price: "£11.95", desc: "Goat on the bone cooked with curry sauce & medium spices" },
          { name: "Prawn Balti", price: "£11.95", desc: "Prawns cooked with tomato, onions and medium spices" },
        ],
      },
      {
        id: "chinese",
        title: "Chinese & Vietnamese",
        blurb: "Small plates, skewers and street-food classics.",
        items: [
          { name: "Mango Papaya Salad", price: "£5.95", desc: "Vietnamese-infused salad: green papaya, mango, peanuts, cherry tomatoes, lime & a sweet-spicy dressing", tags: ["veg"] },
          { name: "Chicken Skewers", price: "£6.95", desc: "Grilled, diced chicken in the chef's signature herb blend" },
          { name: "Salt & Pepper Wings", price: "£6.95", desc: "Crispy wings tossed with salt, pepper, garlic & fresh chillies", tags: ["signature"] },
          { name: "Gyoza Dumplings", price: "from £6.95", desc: "Japanese-style dumplings: chicken, pork or veg" },
          { name: "Chow Mein", price: "from £6.95", desc: "Stir-fried noodles, crisp veg & a savoury sauce. Choose chicken, prawns or veg" },
          { name: "Pork Belly Skewers", price: "£6.95", desc: "Succulent pork belly, marinated & grilled on skewers" },
          { name: "Salt & Pepper Fish", price: "£7.50", desc: "Crispy lightly-battered fish, tossed with garlic, chilli, salt & pepper" },
          { name: "Spring Rolls", price: "£7.95", desc: "Light, crunchy rolls filled with vegetables & pork" },
          { name: "Crispy Squid", price: "£7.95", desc: "Tender squid, flash-fried, tossed with garlic, chilli, salt & pepper" },
          { name: "Char Siu Ribs", price: "£7.95", desc: "Grilled pork ribs in a rich Cantonese char siu sauce", tags: ["signature"] },
          { name: "Summer Rolls", price: "from £7.95", desc: "Rice-paper rolls with herbs & your choice of shrimp, pork or both" },
          { name: "Paratha Belly Buster", price: "£8.95", desc: "Fusion burger: crispy pork belly, lettuce & sriracha mayo", tags: ["signature", "new"] },
          { name: "Grilled Pork Noodles (Bun Thit Nuong)", price: "£8.95", desc: "Vietnamese bowl: grilled pork over vermicelli, salad, pickled veg & vinaigrette" },
          { name: "Bao Buns", price: "£9.95", desc: "Fluffy steamed buns with beef, chicken or veg", tags: ["signature"] },
          { name: "Chilli Pepper King Prawns", price: "£9.95", desc: "Crispy deep-fried prawns, salt, pepper, garlic & fresh chillies", tags: ["spicy"] },
          { name: "Crispy Aromatic Duck", price: "£10.95", desc: "Slow-roasted, shredded duck with pancakes, hoisin, spring onion & cucumber", tags: ["signature"] },
        ],
      },
      {
        id: "mixed-grills",
        title: "Mixed Grills",
        blurb: "Built for sharing. The table centrepiece.",
        items: [
          { name: "Dragon Mix Grill (Regular)", price: "£9.95", desc: "Ribs, salt & pepper wings, pork belly" },
          { name: "Veggie Mixed Grill", price: "£12.95", desc: "Veg samosa, spring roll, paneer tikka, veg chicken tikka & onion bhaji", tags: ["veg"] },
          { name: "Miners Arms Mixed Grill (Regular)", price: "£13.95", desc: "Chicken tikka, chicken wings, sheesh kebab", tags: ["signature"] },
          { name: "Boneless Mixed Grill", price: "£16.95", desc: "Chicken tikka, achari tikka, haryali tikka, sheesh kebab & fish pakora" },
          { name: "Dragon Mixed Grill (Large)", price: "£17.95", desc: "Adds salt & pepper fish and king prawns" },
          { name: "Dragon Mixed Grill (Family)", price: "£18.95", desc: "Ribs, wings, pork belly, salt & pepper fish & king prawns" },
          { name: "Miners Arms Mixed Grill (Large)", price: "£19.95", desc: "Tikka, wings, sheesh, haryali, achari, fish pakora & lamb chops" },
          { name: "Miners Arms Mixed Grill (Family)", price: "£23.95", desc: "The full spread: tikka, wings, sheesh, haryali, achari, fish pakora, lamb chops, chicken pakora & king prawns", tags: ["signature"] },
        ],
      },
      {
        id: "veg-mains",
        title: "Vegetarian Mains",
        items: [
          { name: "Tarka Dal", price: "£6.95", tags: ["veg"] },
          { name: "Chana Masala", price: "£6.95", tags: ["veg"] },
          { name: "Mutter Paneer", price: "£7.95", tags: ["veg"] },
          { name: "Paneer Makhani", price: "£7.95", tags: ["veg"] },
          { name: "Soya Mince Keema", price: "£7.95", tags: ["veg"] },
          { name: "Karahi Paneer", price: "£7.95", tags: ["veg"] },
          { name: "Dal Makhani", price: "£7.95", tags: ["veg"] },
          { name: "Mixed Veg Curry", price: "£7.95", tags: ["veg"] },
          { name: "Saag Paneer", price: "£7.95", tags: ["veg"] },
          { name: "Soya Chicken Curry", price: "£7.95", tags: ["veg"] },
        ],
      },
      {
        id: "rice",
        title: "Rice & Biryani",
        items: [
          { name: "Plain Rice", price: "£2.50" },
          { name: "Jeera Rice", price: "£2.95" },
          { name: "Egg Fried Rice", price: "£3.50" },
          { name: "Mushroom Fried Rice", price: "£3.50" },
          { name: "Garlic Fried Rice", price: "£3.50" },
          { name: "Veg Biryani", price: "£8.95", tags: ["veg"] },
          { name: "Chicken Biryani", price: "£9.95" },
          { name: "Pilau Rice", price: "£9.95" },
          { name: "Lamb Biryani", price: "£10.95" },
          { name: "Prawn Biryani", price: "£10.95" },
          { name: "Mixed Biryani", price: "£11.95", desc: "Lamb, chicken & prawns" },
        ],
      },
      {
        id: "wraps",
        title: "Wraps",
        items: [
          { name: "Chicken Tikka Wrap", price: "£7.95" },
          { name: "Sheesh Kebab Wrap", price: "£7.95" },
          { name: "Paneer Tikka Wrap", price: "£7.95", tags: ["veg"] },
          { name: "Soya Tikka Wrap", price: "£7.95", tags: ["veg"] },
          { name: "Mix Meat Wrap", price: "£8.50" },
        ],
      },
      {
        id: "sides",
        title: "Naan & Sides",
        items: [
          { name: "Poppadoms (2)", price: "£1.50" },
          { name: "Green Salad", price: "£2.00" },
          { name: "Plain Naan", price: "£2.25" },
          { name: "Tandoori Roti", price: "£2.25" },
          { name: "Garlic Naan", price: "£2.80" },
          { name: "Chips", price: "£2.80" },
          { name: "Chilli & Coriander Naan", price: "£3.00" },
          { name: "Garlic Coriander Naan", price: "£3.00" },
          { name: "Cheesy Chips", price: "£3.00" },
          { name: "Raita", price: "£3.00" },
          { name: "Cheese Naan", price: "£3.50" },
          { name: "Masala Chips", price: "£3.50" },
          { name: "Keema Naan", price: "£3.80" },
          { name: "Onion Kulcha Naan", price: "£3.80" },
          { name: "Peshwari Naan", price: "£3.80" },
          { name: "Salt & Pepper Chips", price: "£3.80" },
          { name: "Chilli Chips", price: "£3.80", tags: ["spicy"] },
          { name: "Keema & Cheese Naan", price: "£4.50" },
        ],
      },
      {
        id: "kids",
        title: "Kids Menu",
        items: [
          { name: "Fish Fingers & Chips", price: "£3.95" },
          { name: "Sausages & Chips", price: "£3.95" },
          { name: "Mozzarella Sticks & Chips", price: "£3.95" },
          { name: "Nuggets & Chips", price: "£3.95" },
          { name: "Scampi & Chips", price: "£4.95" },
          { name: "Kids Curry Meal", price: "£6.95", desc: "Butter chicken, chicken curry or korma + baby naan, rice & chips" },
        ],
      },
      {
        id: "dessert",
        title: "Dessert",
        items: [
          { name: "Kulfi", price: "£3.50" },
          { name: "Ice Cream", price: "£3.50", desc: "Strawberry, vanilla or chocolate" },
          { name: "Chocolate Cake", price: "£4.95" },
          { name: "Cheese Cake", price: "£4.95" },
          { name: "Matka Kulfi", price: "£4.95" },
        ],
      },
    ],
  },
  {
    id: "cafe",
    title: "The Day Café",
    kicker: "Breakfast & Light Bites · 7:30am – 2:00pm",
    categories: [
      {
        id: "breakfast",
        title: "Breakfast",
        blurb: "Unlimited tea & coffee with every breakfast, dine-in.",
        items: [
          { name: "Breakfast", price: "£6.00", desc: "Sausage, bacon, egg, beans, tomatoes, mushrooms, hash brown & toast", tags: ["signature"] },
          { name: "Large Breakfast", price: "£8.00", desc: "2× sausage, 2× bacon, 2× eggs, beans, tomatoes, mushroom, 2× hash brown & toast" },
          { name: "Vegetarian Breakfast", price: "£8.00", desc: "2× meat-free sausage, egg, beans, tomatoes, mushroom, hash brown & toast", tags: ["veg"] },
        ],
      },
      {
        id: "paninis",
        title: "Paninis & Toasties",
        items: [
          { name: "Toast", price: "£0.60" },
          { name: "Egg on Toast", price: "£2.50" },
          { name: "Beans on Toast", price: "£2.50" },
          { name: "Cheese & Ham Toastie", price: "£3.50" },
          { name: "Tuna Melt Panini", price: "£4.50" },
          { name: "Tuna Crunch Panini", price: "£4.50" },
          { name: "Chicken Panini", price: "£4.50" },
        ],
      },
      {
        id: "hot-sandwiches",
        title: "Hot Sandwiches",
        items: [
          { name: "Bacon", price: "£3.00" },
          { name: "Egg", price: "£3.00" },
          { name: "Sausage", price: "£3.00" },
          { name: "Bacon & Egg", price: "£4.00" },
          { name: "Sausage & Egg", price: "£4.00" },
          { name: "Fish Finger", price: "£4.00" },
          { name: "Bacon & Sausage", price: "£4.00" },
          { name: "Bacon, Sausage & Egg", price: "£4.50" },
        ],
      },
      {
        id: "burgers",
        title: "Burgers",
        items: [
          { name: "Single Cheeseburger", price: "£4.50" },
          { name: "Chicken Burger", price: "£4.50" },
          { name: "Double Cheeseburger", price: "£5.50" },
          { name: "Cheeseburger, Chips & Drink", price: "£7.00" },
          { name: "Chicken Burger, Chips & Drink", price: "£7.00" },
        ],
      },
      {
        id: "jackets",
        title: "Jacket Potatoes",
        items: [
          { name: "Jacket Potato", price: "£3.00" },
          { name: "Choice of Two Fillings", price: "£1.50", desc: "Tuna, chicken, cheese, beans, coleslaw & chilli con carne" },
        ],
      },
      {
        id: "savouries",
        title: "Savouries & Bakes",
        items: [
          { name: "Sausage Roll", price: "£1.65" },
          { name: "Chicken Bake", price: "£2.50" },
          { name: "Steak Bake", price: "£2.50" },
          { name: "Cheese & Onion Bake", price: "£2.50", tags: ["veg"] },
          { name: "Pepperoni Pizza", price: "£2.80" },
          { name: "BBQ Chicken", price: "£2.80" },
        ],
      },
      {
        id: "cafe-extras",
        title: "Drinks & Extras",
        items: [
          { name: "Tea", price: "£1.70" },
          { name: "Coffee", price: "£1.95" },
          { name: "Hot Chocolate", price: "£1.95" },
          { name: "Caesar Salad", price: "£5.00" },
          { name: "Vegetarian Samosa", price: "£3.00", tags: ["veg"] },
          { name: "Vegetarian Spring Roll", price: "£3.00", tags: ["veg"] },
          { name: "Paneer Pakora", price: "£8.45", tags: ["veg"] },
        ],
      },
    ],
  },
];

// Hand-picked signatures for the homepage showcase.
export const signatures = [
  {
    name: "Crispy Aromatic Duck",
    price: "£10.95",
    origin: "Chinese",
    desc: "Slow-roasted, shredded and served with warm pancakes, hoisin, spring onion & cucumber.",
    image:
      "https://images.unsplash.com/photo-1518983546435-91f8b87fe561?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Butter Chicken",
    price: "£8.95",
    origin: "Indian",
    desc: "Boneless chicken folded through a velvet, slow-simmered butter sauce.",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Miners Arms Mixed Grill",
    price: "£23.95",
    origin: "House",
    desc: "The full spread: tikka, wings, sheesh, lamb chops & king prawns, fresh off the grill.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bao Buns",
    price: "£9.95",
    origin: "Chinese",
    desc: "Pillow-soft steamed buns filled with seasoned beef, chicken or veg.",
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "The Full English",
    price: "£6.00",
    origin: "British",
    desc: "Sausage, bacon, egg, beans, tomatoes, mushrooms, hash brown & toast. Unlimited tea & coffee.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Lamb Chops",
    price: "£9.95",
    origin: "Indian",
    desc: "Char-grilled, deeply spiced lamb chops. The table favourite.",
    image:
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1200&q=80",
  },
];
