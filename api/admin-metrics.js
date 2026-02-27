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

function isAfter(iso, thresholdIso) {
  if (!iso) return false;
  return new Date(iso).getTime() >= new Date(thresholdIso).getTime();
}

async function listAllUsers(supabase) {
  const users = [];
  const perPage = 1000;
  let page = 1;

  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const batch = data?.users || [];
    users.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
  }

  return users;
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
    const users = await listAllUsers(supabase);

    let signedIn24h = 0;
    let signedIn7d = 0;
    let created24h = 0;
    let neverSignedIn = 0;
    let unverifiedOlderThan24h = 0;

    for (const user of users) {
      const createdAt = user?.created_at || null;
      const lastSignInAt = user?.last_sign_in_at || null;
      const emailConfirmedAt = user?.email_confirmed_at || null;

      if (isAfter(lastSignInAt, since24h)) signedIn24h += 1;
      if (isAfter(lastSignInAt, since7d)) signedIn7d += 1;
      if (isAfter(createdAt, since24h)) created24h += 1;
      if (!lastSignInAt) neverSignedIn += 1;
      if (!emailConfirmedAt && createdAt && !isAfter(createdAt, since24h)) {
        unverifiedOlderThan24h += 1;
      }
    }

    const [activeSync24h, activeSync7d] = await Promise.all([
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
        totalUsers: users.length,
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
