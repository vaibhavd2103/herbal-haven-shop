export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Hair Care" | "Skin Care" | "Hygiene" | "Face Care";
  description: string;
  ingredients: string[];
  image: string;
  rating: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Amla & Shikakai Herbal Shampoo",
    price: 349,
    category: "Hair Care",
    description: "A gentle, chemical-free shampoo enriched with Amla and Shikakai extracts. Strengthens hair roots and adds natural shine.",
    ingredients: ["Amla Extract", "Shikakai", "Reetha", "Neem Oil", "Aloe Vera"],
    image: "/placeholder.svg",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "2",
    name: "Turmeric & Sandalwood Face Wash",
    price: 279,
    category: "Face Care",
    description: "Deeply cleanses and brightens skin with the power of turmeric and sandalwood. Suitable for all skin types.",
    ingredients: ["Turmeric Extract", "Sandalwood Powder", "Rose Water", "Honey", "Neem"],
    image: "/placeholder.svg",
    rating: 4.7,
    inStock: true,
  },
  {
    id: "3",
    name: "Coconut & Shea Butter Moisturiser",
    price: 399,
    category: "Skin Care",
    description: "Deep hydration with organic coconut oil and raw shea butter. Locks in moisture for 24 hours without greasiness.",
    ingredients: ["Coconut Oil", "Shea Butter", "Vitamin E", "Jojoba Oil", "Lavender Essential Oil"],
    image: "/placeholder.svg",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "4",
    name: "Neem & Tulsi Herbal Soap",
    price: 149,
    category: "Skin Care",
    description: "Antibacterial handmade soap with neem and tulsi. Protects skin from infections while keeping it soft and supple.",
    ingredients: ["Neem Extract", "Tulsi", "Coconut Oil", "Olive Oil", "Essential Oils"],
    image: "/placeholder.svg",
    rating: 4.3,
    inStock: true,
  },
  {
    id: "5",
    name: "Herbal Sanitary Napkins (Pack of 10)",
    price: 199,
    category: "Hygiene",
    description: "100% organic cotton sanitary napkins infused with herbal extracts. Chemical-free, rash-free, and biodegradable.",
    ingredients: ["Organic Cotton", "Aloe Vera Extract", "Neem Extract", "Biodegradable Core"],
    image: "/placeholder.svg",
    rating: 4.6,
    inStock: true,
  },
  {
    id: "6",
    name: "Bhringraj Hair Oil",
    price: 299,
    category: "Hair Care",
    description: "Traditional Bhringraj oil infused with coconut and sesame oil base. Promotes hair growth and prevents premature greying.",
    ingredients: ["Bhringraj", "Coconut Oil", "Sesame Oil", "Amla", "Brahmi"],
    image: "/placeholder.svg",
    rating: 4.4,
    inStock: true,
  },
  {
    id: "7",
    name: "Rose & Glycerin Face Mist",
    price: 229,
    category: "Face Care",
    description: "Refreshing rose water mist with glycerin for instant hydration. Perfect as a toner or mid-day refresher.",
    ingredients: ["Rose Water", "Glycerin", "Witch Hazel", "Vitamin C", "Cucumber Extract"],
    image: "/placeholder.svg",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "8",
    name: "Charcoal & Tea Tree Face Wash",
    price: 299,
    category: "Face Care",
    description: "Activated charcoal deep-cleanses pores while tea tree oil fights acne-causing bacteria. For oily and combination skin.",
    ingredients: ["Activated Charcoal", "Tea Tree Oil", "Salicylic Acid (Natural)", "Aloe Vera", "Green Tea"],
    image: "/placeholder.svg",
    rating: 4.2,
    inStock: true,
  },
  {
    id: "9",
    name: "Lavender & Oatmeal Body Soap",
    price: 179,
    category: "Skin Care",
    description: "Calming lavender soap with gentle oatmeal exfoliation. Perfect for sensitive skin and relaxation.",
    ingredients: ["Lavender Essential Oil", "Oatmeal", "Shea Butter", "Olive Oil", "Vitamin E"],
    image: "/placeholder.svg",
    rating: 4.6,
    inStock: true,
  },
  {
    id: "10",
    name: "Herbal Panty Liners (Pack of 20)",
    price: 159,
    category: "Hygiene",
    description: "Ultra-thin herbal panty liners with antibacterial properties. Comfortable, breathable, and eco-friendly.",
    ingredients: ["Organic Cotton", "Bamboo Fiber", "Herbal Antibacterial Layer", "Biodegradable Adhesive"],
    image: "/placeholder.svg",
    rating: 4.4,
    inStock: true,
  },
];

export const categories = ["Hair Care", "Skin Care", "Hygiene", "Face Care"] as const;

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    text: "RREVA CARE's shampoo transformed my hair! No more chemical damage, just natural shine.",
    rating: 5,
  },
  {
    id: 2,
    name: "Anita Verma",
    text: "The herbal sanitary napkins are a game-changer. So comfortable and eco-friendly!",
    rating: 5,
  },
  {
    id: 3,
    name: "Meera Patel",
    text: "I love the turmeric face wash. My skin feels so fresh and bright every morning.",
    rating: 4,
  },
];
