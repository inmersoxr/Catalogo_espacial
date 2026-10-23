export const basePath =
  process.env.NODE_ENV === "production" ? "/Catalogo_espacial" : "";
export type Product = {
  id: string;
  name: string;
  category: string;
  reference: string;
  price: number;
  description: string;
  material: string;
};
export type Room = {
  id: string;
  number: string;
  title: string[];
  label: string;
  image: string;
  alt: string;
  caption: string;
  body: string;
  products: Product[];
};
export const rooms: Room[] = [
  {
    id: "living",
    number: "01",
    title: ["LIVING", "ROOM"],
    label: "The art of being at home.",
    image: "living.jpg",
    alt: "Warm living room with a caramel leather sofa, timber furniture and leafy plants",
    caption: "A place to stay a little longer.",
    body: "A sofa becomes an invitation. A lamp sets the mood. Together, they turn a room into a story you can take home.",
    products: [
      {
        id: "SC-L01",
        name: "SLOW",
        category: "Three-seat sofa",
        reference: "001.240.01",
        price: 890,
        description:
          "Generous proportions. A softer pace. A place for conversations that have nowhere else to be.",
        material: "Cognac leather / solid oak",
      },
      {
        id: "SC-L02",
        name: "FORM",
        category: "Coffee table",
        reference: "001.240.02",
        price: 245,
        description:
          "A low, honest silhouette that brings everyday objects together.",
        material: "Oiled oak / warm natural finish",
      },
      {
        id: "SC-L03",
        name: "ARC",
        category: "Reading lamp",
        reference: "001.240.03",
        price: 129,
        description: "A quiet pool of light for one more chapter.",
        material: "Powder-coated steel / warm white LED",
      },
    ],
  },
  {
    id: "bedroom",
    number: "02",
    title: ["BED", "ROOM"],
    label: "Less noise. More room.",
    image: "bedroom.jpg",
    alt: "Quiet neutral bedroom with layered bedding, natural textures and soft daylight",
    caption: "Make space for doing nothing.",
    body: "Texture, light and a quieter rhythm. Discover the pieces that make a private space feel entirely your own.",
    products: [
      {
        id: "SC-B01",
        name: "REST",
        category: "Upholstered bed",
        reference: "002.180.01",
        price: 745,
        description:
          "A grounded form with a soft headboard. Made for the beginning and the end of every day.",
        material: "Woven upholstery / 160 × 200 cm",
      },
      {
        id: "SC-B02",
        name: "FOLD",
        category: "Linen bedding",
        reference: "002.180.02",
        price: 119,
        description:
          "Light layers, lived-in texture. Comfort that gets better with time.",
        material: "European flax linen / ivory",
      },
      {
        id: "SC-B03",
        name: "PAUSE",
        category: "Bedside table",
        reference: "002.180.03",
        price: 165,
        description:
          "Just enough space for the small things that bookend your day.",
        material: "Solid ash / natural finish",
      },
    ],
  },
  {
    id: "dining",
    number: "03",
    title: ["DINING", "ROOM"],
    label: "Good things happen around a table.",
    image: "dining.jpg",
    alt: "Bright dining space with a timber table, sculptural chairs and greenery",
    caption: "Pull up a chair. Stay for a while.",
    body: "Objects create the setting. People give it meaning. A shared space becomes a collection of possibilities.",
    products: [
      {
        id: "SC-D01",
        name: "GATHER",
        category: "Dining table",
        reference: "003.210.01",
        price: 590,
        description:
          "An everyday meeting place. Room for a slow breakfast and a few unexpected guests.",
        material: "Solid oak / 180 × 90 cm",
      },
      {
        id: "SC-D02",
        name: "LOOP",
        category: "Dining chair",
        reference: "003.210.02",
        price: 149,
        description:
          "A curved back, a comfortable seat, and every reason to linger.",
        material: "Bentwood / natural cord",
      },
      {
        id: "SC-D03",
        name: "COMMON",
        category: "Ceramic collection",
        reference: "003.210.03",
        price: 48,
        description:
          "Simple pieces for the rituals we share. A set of four, never quite identical.",
        material: "Glazed stoneware / set of 4",
      },
    ],
  },
];
export const chapters = [
  { id: "cover", label: "Cover" },
  { id: "contents", label: "Contents" },
  { id: "manifesto", label: "A new perspective" },
  { id: "living", label: "Living room" },
  { id: "stories", label: "Every object" },
  { id: "bedroom", label: "Bedroom" },
  { id: "storefront", label: "Space to storefront" },
  { id: "dining", label: "Dining room" },
  { id: "final", label: "The next chapter" },
];
export const price = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
