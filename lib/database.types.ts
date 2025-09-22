export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          image: string | null;
          subtitle: string | null;
          description: string | null;
          price: number;
          discount_price: number | null;
          status: "public" | "draft";
          created_at: string;
          updated_at: string;
          categories: Category[];
        };
        Insert: {
          id?: number;
          name: string;
          image?: string | null;
          subtitle?: string | null;
          description?: string | null;
          price: number;
          discount_price?: number | null;
          status?: "public" | "draft";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          image?: string | null;
          subtitle?: string | null;
          description?: string | null;
          price?: number;
          discount_price?: number | null;
          status?: "public" | "draft";
          created_at?: string;
          updated_at?: string;
        };
      };
      product_categories: {
        Row: {
          product_id: number;
          category_id: number;
        };
        Insert: {
          product_id: number;
          category_id: number;
        };
        Update: {
          product_id?: number;
          category_id?: number;
        };
      };
      orders: {
        Row: {
          id: number;
          order_id: string;
          customer_name: string;
          customer_phone1: string;
          customer_phone2: string | null;
          customer_address: string;
          total_price: number;
          status: "pending" | "paid" | "delivered" | "cancelled";
          payment_status: "unpaid" | "paid" | "refunded";
          delivery_type: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          paid_at: string | null;
          delivered_at: string | null;
        };
        Insert: {
          id?: number;
          order_id: string;
          customer_name: string;
          customer_phone1: string;
          customer_phone2?: string | null;
          customer_address: string;
          total_price: number;
          status?: "pending" | "paid" | "delivered" | "cancelled";
          payment_status?: "unpaid" | "paid" | "refunded";
          delivery_type?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          paid_at?: string | null;
          delivered_at?: string | null;
        };
        Update: {
          id?: number;
          order_id?: string;
          customer_name?: string;
          customer_phone1?: string;
          customer_phone2?: string | null;
          customer_address?: string;
          total_price?: number;
          status?: "pending" | "paid" | "delivered" | "cancelled";
          payment_status?: "unpaid" | "paid" | "refunded";
          delivery_type?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          paid_at?: string | null;
          delivered_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          product_id: number;
          product_name: string;
          product_price: number;
          quantity: number;
          item_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          order_id: string;
          product_id: number;
          product_name: string;
          product_price: number;
          quantity: number;
          item_note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          order_id?: string;
          product_id?: number;
          product_name?: string;
          product_price?: number;
          quantity?: number;
          item_note?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductWithCategories = Product & { categories: Category[] };
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderWithItems = Order & { items: OrderItem[] };
