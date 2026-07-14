const BASE_URL = "https://k25-backend-production.up.railway.app";

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
  // PublicController → GET /api/summary → { target, monthIncome, contributors }
  getSummary: () => fetch(`${BASE_URL}/summary`).then(handle),

  // ── K25 auth (K25Controller) ────────────────────────────────
  k25Register: (data) => fetch(`${BASE_URL}/k25/register`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  }).then(handle),

  k25Login: (data) => fetch(`${BASE_URL}/k25/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  }).then(handle),

  getUser: (id) => fetch(`${BASE_URL}/k25/${id}`).then(handle),

  // Self-delete (User Dashboard "logout & delete account")
  deleteUser: (id) => fetch(`${BASE_URL}/k25/${id}`, { method: "DELETE" }).then(handle),

  // ── Admin auth + management (AdminController, all under /api/admin) ─
  adminLogin: (data) => fetch(`${BASE_URL}/admin/login`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  }).then(handle),

  getAllUsers: () => fetch(`${BASE_URL}/admin/users`).then(handle),

  // Admin removing a member (different endpoint than self-delete above)
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
    body: JSON.stringify({ amount: String(amount) }), // backend expects Map<String,String>
  }).then(handle),

  getExpenses: () => fetch(`${BASE_URL}/admin/expenses`).then(handle),

  addExpense: (amount, description, file) => {
    const form = new FormData();
    form.append("amount", amount);
    form.append("description", description);
    form.append("screenshot", file); // required by AdminController, not optional
    return fetch(`${BASE_URL}/admin/expenses`, { method: "POST", body: form }).then(handle);
  },

  // ── Contributions (ContributionController) ───────────────────
  submitContribution: (userId, amount, file) => {
    const form = new FormData();
    form.append("userId", userId);
    form.append("amount", amount);
    form.append("screenshot", file); // required by ContributionController, not optional
    return fetch(`${BASE_URL}/contributions`, { method: "POST", body: form }).then(handle);
  },

  getUserContributions: (userId) => fetch(`${BASE_URL}/contributions/user/${userId}`).then(handle),

  fileUrl: (path) => path ? `http://localhost:8080/uploads/${path}` : null,
};

export default api;