import herbalShampoo from "@/assets/products/herbal-shampoo.jpg";
import faceWash from "@/assets/products/face-wash.jpg";
import moisturiser from "@/assets/products/moisturiser.jpg";
import herbalSoap from "@/assets/products/herbal-soap.jpg";
import hairOil from "@/assets/products/hair-oil.jpg";
import faceMist from "@/assets/products/face-mist.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrls: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Amla & Shikakai Herbal Shampoo",
    price: 349,
    currency: "INR",
    description:
      "A gentle, chemical-free shampoo enriched with Amla and Shikakai extracts. Strengthens hair roots and adds natural shine.",
    ingredients: [
      "Amla Extract",
      "Shikakai",
      "Reetha",
      "Neem Oil",
      "Aloe Vera",
    ],
    benefits: [
      "Strengthens hair roots",
      "Adds natural shine",
      "Reduces hair fall",
      "Chemical-free formula",
    ],
    howToUse: [
      "Wet hair thoroughly",
      "Apply a small amount and lather",
      "Massage gently into scalp",
      "Rinse with water",
    ],
    imageUrls: [herbalShampoo],
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "2",
    name: "Turmeric & Sandalwood Face Wash",
    price: 279,
    currency: "INR",
    description:
      "Deeply cleanses and brightens skin with the power of turmeric and sandalwood. Suitable for all skin types.",
    ingredients: [
      "Turmeric Extract",
      "Sandalwood Powder",
      "Rose Water",
      "Honey",
      "Neem",
    ],
    benefits: [
      "Brightens skin tone",
      "Deep cleansing",
      "Anti-inflammatory",
      "Suitable for all skin types",
    ],
    howToUse: [
      "Wet face with water",
      "Take a coin-sized amount",
      "Gently massage in circular motions",
      "Rinse off with cool water",
    ],
    imageUrls: [faceWash],
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "3",
    name: "Coconut & Shea Butter Moisturiser",
    price: 399,
    currency: "INR",
    description:
      "Deep hydration with organic coconut oil and raw shea butter. Locks in moisture for 24 hours without greasiness.",
    ingredients: [
      "Coconut Oil",
      "Shea Butter",
      "Vitamin E",
      "Jojoba Oil",
      "Lavender Essential Oil",
    ],
    benefits: [
      "24-hour hydration",
      "Non-greasy formula",
      "Nourishes dry skin",
      "Natural fragrance",
    ],
    howToUse: [
      "Cleanse skin first",
      "Take a small amount",
      "Apply evenly on face and body",
      "Use twice daily for best results",
    ],
    imageUrls: [moisturiser],
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "4",
    name: "Neem & Tulsi Herbal Soap",
    price: 149,
    currency: "INR",
    description:
      "Antibacterial handmade soap with neem and tulsi. Protects skin from infections while keeping it soft and supple.",
    ingredients: [
      "Neem Extract",
      "Tulsi",
      "Coconut Oil",
      "Olive Oil",
      "Essential Oils",
    ],
    benefits: [
      "Antibacterial protection",
      "Keeps skin soft",
      "Handmade with care",
      "Chemical-free",
    ],
    howToUse: [
      "Wet the soap bar",
      "Create a rich lather",
      "Apply on body",
      "Rinse thoroughly",
    ],
    imageUrls: [herbalSoap],
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "5",
    name: "Bhringraj Hair Oil",
    price: 299,
    currency: "INR",
    description:
      "Traditional Bhringraj oil infused with coconut and sesame oil base. Promotes hair growth and prevents premature greying.",
    ingredients: ["Bhringraj", "Coconut Oil", "Sesame Oil", "Amla", "Brahmi"],
    benefits: [
      "Promotes hair growth",
      "Prevents greying",
      "Strengthens roots",
      "Reduces dandruff",
    ],
    howToUse: [
      "Warm the oil slightly",
      "Apply on scalp and hair",
      "Massage for 10 minutes",
      "Leave for 1 hour or overnight, then wash",
    ],
    imageUrls: [hairOil],
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "6",
    name: "Rose & Glycerin Face Mist",
    price: 229,
    currency: "INR",
    description:
      "Refreshing rose water mist with glycerin for instant hydration. Perfect as a toner or mid-day refresher.",
    ingredients: [
      "Rose Water",
      "Glycerin",
      "Witch Hazel",
      "Vitamin C",
      "Cucumber Extract",
    ],
    benefits: [
      "Instant hydration",
      "Natural toner",
      "Refreshes skin",
      "Soothes irritation",
    ],
    howToUse: [
      "Hold 6 inches from face",
      "Close eyes and spray",
      "Let it absorb naturally",
      "Use anytime for a refresh",
    ],
    imageUrls: [faceMist],
    isActive: true,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
];

export const categories = [
  "Hair Care",
  "Skin Care",
  "Hygiene",
  "Face Care",
] as const;

// export const testimonials = [
//   {
//     id: 1,
//     user: {
//       name: "Priya Sharma",
//       id: "priya-sharma",
//     },
//     text: "RREVA CARE's shampoo transformed my hair! No more chemical damage, just natural shine.",
//     rating: 5,
//   },
//   {
//     id: 2,
//     user: {
//       name: "Anita Verma",
//       id: "anita-verma",
//     },
//     text: "The herbal sanitary napkins are a game-changer. So comfortable and eco-friendly!",
//     rating: 5,
//   },
//   {
//     id: 3,
//     user: {
//       name: "Meera Patel",
//       id: "meera-patel",
//     },
//     text: "I love the turmeric face wash. My skin feels so fresh and bright every morning.",
//     rating: 4,
//   },
// ];
