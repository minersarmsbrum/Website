import { menu as seedMenu } from "@/data/menu";
import type { MenuSection, MenuCategory, Dish } from "@/data/menu";

// ─── Booking types (used by portal pages and db.ts) ───────────────────────────

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

// ─── Gallery types (used by portal pages and db.ts) ───────────────────────────

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  tall?: boolean;
  storagePath?: string;
};

// ─── Menu types ───────────────────────────────────────────────────────────────

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

// ─── In-memory menu store ─────────────────────────────────────────────────────

const menuSections: StoreSection[] = seedMenuWithIds(seedMenu);

export const store = {
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
