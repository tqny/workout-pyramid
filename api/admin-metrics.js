import { createClient } from "@supabase/supabase-js";

function badRequest(res, status, error) {
  return res.status(status).json({ error });
}

function getAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getCount(builderPromise) {
  const { count, error } = await builderPromise;
  if (error) throw error;
  return Number(count || 0);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return badRequest(res, 405, "Method not allowed");
  }

  const expectedAdminKey = process.env.ADMIN_METRICS_KEY;
  const providedAdminKey = req.headers["x-admin-metrics-key"];

  if (!expectedAdminKey) {
    return badRequest(res, 500, "Server is missing ADMIN_METRICS_KEY");
  }
  if (!providedAdminKey || providedAdminKey !== expectedAdminKey) {
    return badRequest(res, 401, "Unauthorized");
  }

  try {
    const supabase = getAdminClient();
    const now = new Date();
    const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const users = supabase.schema("auth").from("users");

    const [
      totalUsers,
      signedIn24h,
      signedIn7d,
      created24h,
      neverSignedIn,
      unverifiedOlderThan24h,
      activeSync24h,
      activeSync7d,
    ] = await Promise.all([
      getCount(users.select("id", { head: true, count: "exact" })),
      getCount(users.select("id", { head: true, count: "exact" }).gte("last_sign_in_at", since24h)),
      getCount(users.select("id", { head: true, count: "exact" }).gte("last_sign_in_at", since7d)),
      getCount(users.select("id", { head: true, count: "exact" }).gte("created_at", since24h)),
      getCount(users.select("id", { head: true, count: "exact" }).is("last_sign_in_at", null)),
      getCount(
        users
          .select("id", { head: true, count: "exact" })
          .is("email_confirmed_at", null)
          .lt("created_at", since24h)
      ),
      getCount(
        supabase
          .from("user_app_state")
          .select("user_id", { head: true, count: "exact" })
          .gte("updated_at", since24h)
      ),
      getCount(
        supabase
          .from("user_app_state")
          .select("user_id", { head: true, count: "exact" })
          .gte("updated_at", since7d)
      ),
    ]);

    return res.status(200).json({
      generatedAt: now.toISOString(),
      windows: {
        since24h,
        since7d,
      },
      metrics: {
        totalUsers,
        signedIn24h,
        signedIn7d,
        created24h,
        activeSync24h,
        activeSync7d,
        unverifiedOlderThan24h,
        neverSignedIn,
        attentionNeeded: unverifiedOlderThan24h + neverSignedIn,
      },
    });
  } catch (error) {
    return badRequest(res, 500, error?.message || "Failed to load admin metrics");
  }
}
