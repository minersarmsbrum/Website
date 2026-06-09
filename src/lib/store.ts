import { gallery as seedGallery } from "@/data/images";
import { menu as seedMenu } from "@/data/menu";
import type { MenuSection, MenuCategory, Dish } from "@/data/menu";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  tall?: boolean;
  storagePath?: string; // Supabase Storage path for deletion
};

// Extend menu types with runtime IDs for CRUD
export type StoreDish = Dish & { id: string };
export type StoreCategory = Omit<MenuCategory, "items"> & { items: StoreDish[] };
export type StoreSection = Omit<MenuSection, "categories"> & { categories: StoreCategory[] };

// ─── Seed helpers ─────────────────────────────────────────────────────────────

let _id = 1;
const uid = () => String(_id++);

function seedMenuWithIds(sections: MenuSection[]): StoreSection[] {
  return sections.map((s) => ({
    ...s,
    categories: s.categories.map((c) => ({
      ...c,
      items: c.items.map((item) => ({ ...item, id: uid() })),
    })),
  }));
}

// ─── In-memory store ──────────────────────────────────────────────────────────

const bookings: Booking[] = [
  { id: uid(), name: "James Hartley", email: "james@example.com", phone: "07700900001", date: "2026-06-12", time: "19:00", guests: 4, notes: "Anniversary dinner", status: "confirmed", createdAt: "2026-06-01T10:00:00Z" },
  { id: uid(), name: "Priya Sharma", email: "priya@example.com", phone: "07700900002", date: "2026-06-13", time: "20:00", guests: 2, notes: "", status: "pending", createdAt: "2026-06-02T11:30:00Z" },
  { id: uid(), name: "David Chen", email: "david@example.com", phone: "07700900003", date: "2026-06-14", time: "18:30", guests: 6, notes: "Birthday party, please prepare table", status: "confirmed", createdAt: "2026-06-02T14:00:00Z" },
  { id: uid(), name: "Sarah Williams", email: "sarah@example.com", phone: "07700900004", date: "2026-06-15", time: "13:00", guests: 3, notes: "One vegetarian", status: "pending", createdAt: "2026-06-03T09:15:00Z" },
  { id: uid(), name: "Mohammed Ali", email: "mohammed@example.com", phone: "07700900005", date: "2026-06-10", time: "19:30", guests: 8, notes: "Work team lunch", status: "confirmed", createdAt: "2026-06-03T16:45:00Z" },
  { id: uid(), name: "Emma Thompson", email: "emma@example.com", phone: "07700900006", date: "2026-06-09", time: "12:30", guests: 2, notes: "", status: "cancelled", createdAt: "2026-06-04T08:00:00Z" },
  { id: uid(), name: "Raj Patel", email: "raj@example.com", phone: "07700900007", date: "2026-06-16", time: "20:30", guests: 5, notes: "Requesting window table", status: "pending", createdAt: "2026-06-04T12:00:00Z" },
  { id: uid(), name: "Chloe Baker", email: "chloe@example.com", phone: "07700900008", date: "2026-06-17", time: "19:00", guests: 10, notes: "Large family gathering, need extended table", status: "confirmed", createdAt: "2026-06-05T17:30:00Z" },
];

const galleryItems: GalleryItem[] = seedGallery.map((g) => ({ ...g, id: uid() }));

const menuSections: StoreSection[] = seedMenuWithIds(seedMenu);

// ─── Bookings CRUD ────────────────────────────────────────────────────────────

export const store = {
  bookings: {
    list: (): Booking[] => [...bookings],

    add: (data: Omit<Booking, "id" | "createdAt" | "status">): Booking => {
      const b: Booking = { ...data, id: uid(), status: "pending", createdAt: new Date().toISOString() };
      bookings.push(b);
      return b;
    },

    updateStatus: (id: string, status: BookingStatus): Booking | null => {
      const b = bookings.find((x) => x.id === id);
      if (!b) return null;
      b.status = status;
      return b;
    },

    delete: (id: string): boolean => {
      const i = bookings.findIndex((x) => x.id === id);
      if (i === -1) return false;
      bookings.splice(i, 1);
      return true;
    },
  },

  gallery: {
    list: (): GalleryItem[] => [...galleryItems],

    add: (item: Omit<GalleryItem, "id">): GalleryItem => {
      const g: GalleryItem = { ...item, id: uid() };
      galleryItems.push(g);
      return g;
    },

    delete: (id: string): GalleryItem | null => {
      const i = galleryItems.findIndex((x) => x.id === id);
      if (i === -1) return null;
      const [removed] = galleryItems.splice(i, 1);
      return removed;
    },
  },

  menu: {
    list: (): StoreSection[] => menuSections,

    addCategory: (sectionId: string, data: { title: string; blurb?: string }): StoreCategory | null => {
      const section = menuSections.find((s) => s.id === sectionId);
      if (!section) return null;
      const cat: StoreCategory = { id: uid(), title: data.title, blurb: data.blurb, items: [] };
      section.categories.push(cat);
      return cat;
    },

    updateCategory: (sectionId: string, catId: string, data: { title?: string; blurb?: string }): StoreCategory | null => {
      const cat = menuSections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return null;
      if (data.title !== undefined) cat.title = data.title;
      if (data.blurb !== undefined) cat.blurb = data.blurb;
      return cat;
    },

    deleteCategory: (sectionId: string, catId: string): boolean => {
      const section = menuSections.find((s) => s.id === sectionId);
      if (!section) return false;
      const i = section.categories.findIndex((c) => c.id === catId);
      if (i === -1) return false;
      section.categories.splice(i, 1);
      return true;
    },

    addItem: (sectionId: string, catId: string, data: Omit<StoreDish, "id">): StoreDish | null => {
      const cat = menuSections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return null;
      const item: StoreDish = { ...data, id: uid() };
      cat.items.push(item);
      return item;
    },

    updateItem: (sectionId: string, catId: string, itemId: string, data: Partial<Omit<StoreDish, "id">>): StoreDish | null => {
      const cat = menuSections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return null;
      const item = cat.items.find((i) => i.id === itemId);
      if (!item) return null;
      Object.assign(item, data);
      return item;
    },

    deleteItem: (sectionId: string, catId: string, itemId: string): boolean => {
      const cat = menuSections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return false;
      const i = cat.items.findIndex((x) => x.id === itemId);
      if (i === -1) return false;
      cat.items.splice(i, 1);
      return true;
    },
  },
};
