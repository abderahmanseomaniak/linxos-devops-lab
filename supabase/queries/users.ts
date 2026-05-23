import "server-only";

import { createClient } from "@/supabase/server";

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createUser(input: {
  email: string;
  name: string;
  phone?: string;
  cin?: string;
  role: string;
  status?: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(
  id: string,
  input: Partial<{
    email: string;
    name: string;
    phone: string;
    cin: string;
    role: string;
    status: boolean;
    avatar: string;
  }>,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
}
