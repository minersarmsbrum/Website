import { serverClient } from "./supabase";
import type { Booking, BookingStatus, GalleryItem, StoreSection, StoreCategory, StoreDish } from "./store";
import { menu as seedMenu } from "@/data/menu";
import type { MenuSection } from "@/data/menu";

// ─── Raw Supabase row shapes ───────────────────────────────────────────────────

type BookingRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: string;
  created_at: string;
};

type GalleryRow = {
  id: string;
  src: string;
  alt: string;
  tall: boolean;
  storage_path: string | null;
  created_at: string;
};

// ─── Mappers (snake_case → camelCase) ─────────────────────────────────────────

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    date: row.date,
    time: row.time,
    guests: row.guests,
    notes: row.notes,
    status: row.status as BookingStatus,
    createdAt: row.created_at,
  };
}

function toGalleryItem(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    src: row.src,
    alt: row.alt,
    tall: row.tall,
    storagePath: row.storage_path ?? undefined,
  };
}

// ─── Menu seed helpers ────────────────────────────────────────────────────────

let _id = Date.now();
const uid = () => String(_id++);

function seedWithIds(sections: MenuSection[]): StoreSection[] {
  return sections.map((s) => ({
    ...s,
    categories: s.categories.map((c) => ({
      ...c,
      items: c.items.map((item) => ({ ...item, id: uid() })),
    })),
  }));
}

// ─── Database layer ────────────────────────────────────────────────────────────

export const db = {
  bookings: {
    async list(): Promise<Booking[]> {
      const { data, error } = await serverClient()
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as BookingRow[]).map(toBooking);
    },

    async add(data: Omit<Booking, "id" | "createdAt" | "status"> & { status?: BookingStatus }): Promise<Booking> {
      const { data: row, error } = await serverClient()
        .from("bookings")
        .insert({ ...data, status: data.status ?? "confirmed" })
        .select()
        .single();
      if (error) throw error;
      return toBooking(row as BookingRow);
    },

    async updateStatus(id: string, status: BookingStatus): Promise<Booking | null> {
      const { data: row, error } = await serverClient()
        .from("bookings")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) return null;
      return toBooking(row as BookingRow);
    },

    async updateDetails(id: string, data: { date?: string; time?: string; guests?: number }): Promise<Booking | null> {
      const { data: row, error } = await serverClient()
        .from("bookings")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) return null;
      return toBooking(row as BookingRow);
    },

    async delete(id: string): Promise<boolean> {
      const { data, error } = await serverClient()
        .from("bookings")
        .delete()
        .eq("id", id)
        .select("id");
      if (error) return false;
      return Array.isArray(data) && data.length > 0;
    },
  },

  gallery: {
    async list(): Promise<GalleryItem[]> {
      const { data, error } = await serverClient()
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as GalleryRow[]).map(toGalleryItem);
    },

    async add(item: Omit<GalleryItem, "id">): Promise<GalleryItem> {
      const { data: row, error } = await serverClient()
        .from("gallery_items")
        .insert({
          src: item.src,
          alt: item.alt,
          tall: item.tall ?? false,
          storage_path: item.storagePath ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return toGalleryItem(row as GalleryRow);
    },

    async delete(id: string): Promise<GalleryItem | null> {
      const { data: row, error: fetchError } = await serverClient()
        .from("gallery_items")
        .select("*")
        .eq("id", id)
        .single();
      if (fetchError || !row) return null;

      const { error: deleteError } = await serverClient()
        .from("gallery_items")
        .delete()
        .eq("id", id);
      if (deleteError) return null;

      return toGalleryItem(row as GalleryRow);
    },
  },

  menu: {
    async load(): Promise<StoreSection[]> {
      const { data, error } = await serverClient()
        .from("menu_data")
        .select("sections")
        .eq("id", 1)
        .single();

      if (error || !data) {
        // Table empty on first run — seed from static file and persist
        const seeded = seedWithIds(seedMenu);
        await serverClient()
          .from("menu_data")
          .insert({ id: 1, sections: seeded });
        return seeded;
      }

      return data.sections as StoreSection[];
    },

    async save(sections: StoreSection[]): Promise<void> {
      await serverClient()
        .from("menu_data")
        .upsert({ id: 1, sections, updated_at: new Date().toISOString() });
    },

    async addCategory(sectionId: string, data: { title: string; blurb?: string }): Promise<StoreCategory | null> {
      const sections = await db.menu.load();
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return null;
      const cat: StoreCategory = { id: uid(), title: data.title, blurb: data.blurb, items: [] };
      section.categories.push(cat);
      await db.menu.save(sections);
      return cat;
    },

    async updateCategory(sectionId: string, catId: string, data: { title?: string; blurb?: string }): Promise<StoreCategory | null> {
      const sections = await db.menu.load();
      const cat = sections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return null;
      if (data.title !== undefined) cat.title = data.title;
      if (data.blurb !== undefined) cat.blurb = data.blurb;
      await db.menu.save(sections);
      return cat;
    },

    async deleteCategory(sectionId: string, catId: string): Promise<boolean> {
      const sections = await db.menu.load();
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return false;
      const i = section.categories.findIndex((c) => c.id === catId);
      if (i === -1) return false;
      section.categories.splice(i, 1);
      await db.menu.save(sections);
      return true;
    },

    async addItem(sectionId: string, catId: string, data: Omit<StoreDish, "id">): Promise<StoreDish | null> {
      const sections = await db.menu.load();
      const cat = sections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return null;
      const item: StoreDish = { ...data, id: uid() };
      cat.items.push(item);
      await db.menu.save(sections);
      return item;
    },

    async updateItem(sectionId: string, catId: string, itemId: string, data: Partial<Omit<StoreDish, "id">>): Promise<StoreDish | null> {
      const sections = await db.menu.load();
      const cat = sections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return null;
      const item = cat.items.find((i) => i.id === itemId);
      if (!item) return null;
      Object.assign(item, data);
      await db.menu.save(sections);
      return item;
    },

    async deleteItem(sectionId: string, catId: string, itemId: string): Promise<boolean> {
      const sections = await db.menu.load();
      const cat = sections.find((s) => s.id === sectionId)?.categories.find((c) => c.id === catId);
      if (!cat) return false;
      const i = cat.items.findIndex((x) => x.id === itemId);
      if (i === -1) return false;
      cat.items.splice(i, 1);
      await db.menu.save(sections);
      return true;
    },
  },
};
