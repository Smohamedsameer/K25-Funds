const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

async function handle(res) {
  if (!res.ok) {
    let msg = "Request failed";
    try { const body = await res.json(); msg = body.message || msg; } catch (_) {}
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  // ── Public stats (Home page cards) ─────────────────────────
  getSummary: () => fetch(`${BASE_URL}/summary`).then(handle),

  // ── K25 auth (K25Controller) ────────────────────────────────
  k25Register: (data) => fetch(`${BASE_URL}/k25/register`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  }).then(handle),

  k25Login: (data) => fetch(`${BASE_URL}/k25/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  }).then(handle),

  getUser: (id) => fetch(`${BASE_URL}/k25/${id}`).then(handle),

  deleteUser: (id) => fetch(`${BASE_URL}/k25/${id}`, { method: "DELETE" }).then(handle),

  // ── Admin auth + management (AdminController, all under /api/admin) ─
  adminLogin: (data) => fetch(`${BASE_URL}/admin/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  }).then(handle),

  getAllUsers: () => fetch(`${BASE_URL}/admin/users`).then(handle),

  deleteUserAsAdmin: (id) => fetch(`${BASE_URL}/admin/users/${id}`, { method: "DELETE" }).then(handle),

  getContributions: () => fetch(`${BASE_URL}/admin/contributions`).then(handle),

  updateContributionStatus: (id, status) => fetch(`${BASE_URL}/admin/contributions/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(handle),

  deleteContribution: (id) => fetch(`${BASE_URL}/admin/contributions/${id}`, { method: "DELETE" }).then(handle),

  getAdminSummary: () => fetch(`${BASE_URL}/admin/summary`).then(handle),

  updateTarget: (amount) => fetch(`${BASE_URL}/admin/target`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: String(amount) }),
  }).then(handle),

  getExpenses: () => fetch(`${BASE_URL}/admin/expenses`).then(handle),

  addExpense: (amount, description, file) => {
    const form = new FormData();
    form.append("amount", amount);
    form.append("description", description);
    form.append("screenshot", file);
    return fetch(`${BASE_URL}/admin/expenses`, { method: "POST", body: form }).then(handle);
  },

  // ── Contributions (ContributionController) ───────────────────
  submitContribution: (userId, amount, file) => {
    const form = new FormData();
    form.append("userId", userId);
    form.append("amount", amount);
    form.append("screenshot", file);
    return fetch(`${BASE_URL}/contributions`, { method: "POST", body: form }).then(handle);
  },

  getUserContributions: (userId) => fetch(`${BASE_URL}/contributions/user/${userId}`).then(handle),

  // ── Screenshot / uploaded-file URL builder ────────────────────
  // Works no matter which shape the backend returns:
  //   "abc.jpg"  |  "uploads/abc.jpg"  |  "/uploads/abc.jpg"  |  "https://.../abc.jpg"
  fileUrl: (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.replace(/^\/+/, "");
    const withUploads = clean.startsWith("uploads/") ? clean : `uploads/${clean}`;
    return `${import.meta.env.VITE_API_URL}/${withUploads}`;
  },

  // Pulls whichever field name the backend actually used for a record's screenshot.
  screenshotPathOf: (record) =>
    record?.screenshotPath ?? record?.screenshotUrl ?? record?.screenshot ?? null,
};

export default api;