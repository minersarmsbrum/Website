import { serverClient } from "./supabase";
import type { Booking, BookingStatus, GalleryItem } from "./store";

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

    async add(data: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
      const { data: row, error } = await serverClient()
        .from("bookings")
        .insert({ ...data, status: "pending" })
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

    async delete(id: string): Promise<boolean> {
      const { error } = await serverClient()
        .from("bookings")
        .delete()
        .eq("id", id);
      return !error;
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
};
