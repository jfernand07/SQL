
// app.js
// Complete frontend logic for CRUD + CSV import using Supabase
// - Table used: "users" (columns: id, nombre OR name, email, age, phone)
// - Put your Supabase credentials below

/* --------------------------
SUPABASE CONFIG - replace with your values
   -------------------------- */
const SUPABASE_URL = "https://yxexybyocdhbwojqetdf.supabase.co"; // <-- replace
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZXh5YnlvY2RoYndvanFldGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTU0MTUsImV4cCI6MjA3MDUzMTQxNX0.cZWtoTzOQKksWoeoh0c9nqwc4NcKi1jgptdYT7z0Exo";               // <-- replace
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* --------------------------
DOM references (these IDs must exist in your HTML)
   -------------------------- */
const tbody = document.querySelector("#records-table tbody");
const emptyState = document.getElementById("emptyState");

const btnOpenAdd = document.getElementById("btnOpenAdd");
const formSection = document.getElementById("formSection");
const formRecord = document.getElementById("formRecord");
const btnCancelForm = document.getElementById("btnCancelForm");
const messageBox = document.getElementById("messageBox");
const csvFileInput = document.getElementById("csvFile");
const btnRefresh = document.getElementById("btnRefresh");

/* --------------------------
Minor config
   -------------------------- */
const TABLE_NAME = "users"; // Supabase table name
const CSV_INSERT_CHUNK = 100; // how many rows per insert chunk when importing CSV

/* --------------------------
Boot
   -------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Bind UI events
btnOpenAdd?.addEventListener("click", openAddForm);
btnCancelForm?.addEventListener("click", cancelForm);
formRecord?.addEventListener("submit", addRecord);
csvFileInput?.addEventListener("change", handleCsvFile);
btnRefresh?.addEventListener("click", loadRecords);

  // initial load
loadRecords();
});

/* --------------------------
LOAD (READ)
Fetch records from Supabase and render table
   -------------------------- */
async function loadRecords() {
try {
    // Select all columns. Order by id asc.
    const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("id", { ascending: true });

    if (error) throw error;

    // Clear table
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
    emptyState?.classList.remove("hidden");
    return;
    } else {
    emptyState?.classList.add("hidden");
    }

    data.forEach(rec => {
    const tr = document.createElement("tr");
    tr.dataset.id = rec.id;

      // Normalize fields: support both 'name'/'nombre' depending on your schema
    const name = rec.nombre ?? rec.name ?? "";
    const email = rec.email ?? "";
    const age = rec.age ?? rec.edad ?? "";
    const phone = rec.phone ?? rec.telefono ?? "";

    tr.innerHTML = `
        <td>${escapeHtml(rec.id)}</td>
        <td class="cell-name">${escapeHtml(name)}</td>
        <td class="cell-email">${escapeHtml(email)}</td>
        <td class="cell-age">${escapeHtml(String(age))}</td>
        <td class="cell-phone">${escapeHtml(phone)}</td>
        <td class="actions-cell"></td>
    `;

      // actions column buttons
    const actionsTd = tr.querySelector(".actions-cell");

    const editBtn = document.createElement("button");
    editBtn.className = "btn edit";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => enterEditMode(tr));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteRecord(tr));

    actionsTd.append(editBtn, deleteBtn);

    tbody.append(tr);
    });
} catch (err) {
    console.error("Error loading records:", err);
    alert("Unable to load records. Check console for details.");
}
}

/* --------------------------
UI: open / cancel form
   -------------------------- */
function openAddForm() {
messageBox && (messageBox.textContent = "");
formRecord && formRecord.reset();
formSection?.classList.remove("hidden");
  // focus first input if exists
const first = document.querySelector("#inputName, #inputNombre, #input-name");
if (first) first.focus();
}

function cancelForm() {
if (!confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) return;
formRecord?.reset();
messageBox && (messageBox.textContent = "");
formSection?.classList.add("hidden");
}

/* --------------------------
CREATE (Add new record)
- Uses fields in the form: try to find input IDs in this order:
    inputName or inputNombre or input-name
    inputEmail or input-email
    inputAge or input-age
    inputPhone or input-phone
   -------------------------- */
async function addRecord(event) {
event.preventDefault();
messageBox && (messageBox.textContent = "");

  // Try multiple possible input IDs so the JS works with different HTML variants
const nameInput = document.getElementById("inputName")
    || document.getElementById("inputNombre")
    || document.querySelector("input[name='name']")
    || document.querySelector("input[name='nombre']");

const emailInput = document.getElementById("inputEmail")
    || document.querySelector("input[name='email']");

const ageInput = document.getElementById("inputAge")
    || document.querySelector("input[name='age']")
    || document.querySelector("input[name='edad']");

const phoneInput = document.getElementById("inputPhone")
    || document.querySelector("input[name='phone']")
    || document.querySelector("input[name='telefono']");

const name = nameInput?.value?.trim() ?? "";
const email = emailInput?.value?.trim() ?? "";
const age = ageInput ? parseInt(ageInput.value, 10) : NaN;
const phone = phoneInput?.value?.trim() ?? "";

  // basic validation
if (!name || !email || !phone || !Number.isInteger(age) || age <= 0) {
    if (messageBox) {
    messageBox.textContent = "Please fill all fields correctly.";
    messageBox.style.color = "red";
    } else {
    alert("Please fill all fields correctly.");
    }
    return;
}

  // confirmation
if (!confirm(`Create record:\nName: ${name}\nEmail: ${email}\nAge: ${age}\nPhone: ${phone}\n\nProceed?`)) {
    return;
}

try {
    // Insert into Supabase table 'users'
    const payload = {
      // your DB column names: try to use both variations: prefer 'nombre' if exists in your DB
    nombre: name,
    email,
    age,
    phone
    };

    // If your table uses different column names (e.g. name instead of nombre),
    // Supabase will ignore unknown columns — adjust DB accordingly.
    const { error } = await supabase.from(TABLE_NAME).insert([payload]);
    if (error) throw error;

    if (messageBox) {
    messageBox.textContent = "Record created successfully.";
    messageBox.style.color = "green";
    } else {
    alert("Record created successfully.");
    }

    formRecord?.reset();
    formSection?.classList.add("hidden");
    await loadRecords();
} catch (err) {
    console.error("Error creating record:", err);
    if (messageBox) {
    messageBox.textContent = "Server error creating record.";
    messageBox.style.color = "red";
    } else {
    alert("Server error creating record.");
    }
}
}

/* --------------------------
EDIT / Update (inline)
Convert row into inputs, save with SUPABASE update
   -------------------------- */
function enterEditMode(tr) {
const id = tr.dataset.id;
const tdName = tr.querySelector(".cell-name");
const tdEmail = tr.querySelector(".cell-email");
const tdAge = tr.querySelector(".cell-age");
const tdPhone = tr.querySelector(".cell-phone");
const tdActions = tr.querySelector(".actions-cell");

const oldName = tdName.textContent;
const oldEmail = tdEmail.textContent;
const oldAge = tdAge.textContent;
const oldPhone = tdPhone.textContent;

  // Replace with inputs
tdName.innerHTML = `<input type="text" value="${escapeHtmlAttr(oldName)}">`;
tdEmail.innerHTML = `<input type="email" value="${escapeHtmlAttr(oldEmail)}">`;
tdAge.innerHTML = `<input type="number" value="${escapeHtmlAttr(oldAge)}">`;
tdPhone.innerHTML = `<input type="text" value="${escapeHtmlAttr(oldPhone)}">`;

  // Save / Cancel buttons
tdActions.innerHTML = "";

const saveBtn = document.createElement("button");
saveBtn.className = "btn primary";
saveBtn.textContent = "Save";
saveBtn.addEventListener("click", async () => {
    const newName = tdName.querySelector("input").value.trim();
    const newEmail = tdEmail.querySelector("input").value.trim();
    const newAge = parseInt(tdAge.querySelector("input").value, 10);
    const newPhone = tdPhone.querySelector("input").value.trim();

    if (!newName || !newEmail || !newPhone || !Number.isInteger(newAge) || newAge <= 0) {
    alert("Please enter valid values.");
    return;
    }

    if (!confirm(`Save changes?\nName: ${newName}\nEmail: ${newEmail}\nAge: ${newAge}\nPhone: ${newPhone}`)) return;

    try {
      // Build payload; use 'nombre' field to match DB schema
    const payload = { nombre: newName, email: newEmail, age: newAge, phone: newPhone };

    const { error } = await supabase.from(TABLE_NAME).update(payload).eq("id", id);
    if (error) throw error;

    await loadRecords();
    } catch (err) {
    console.error("Error saving:", err);
    alert("Could not update record.");
    }
});

const cancelBtn = document.createElement("button");
cancelBtn.className = "btn ghost";
cancelBtn.textContent = "Cancel";
cancelBtn.addEventListener("click", () => {
    // restore original values
    tdName.textContent = oldName;
    tdEmail.textContent = oldEmail;
    tdAge.textContent = oldAge;
    tdPhone.textContent = oldPhone;
    tdActions.innerHTML = "";
    // recreate action buttons
    const editBtn = document.createElement("button");
    editBtn.className = "btn edit";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => enterEditMode(tr));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteRecord(tr));

    tdActions.append(editBtn, deleteBtn);
});

tdActions.append(saveBtn, cancelBtn);
}

/* --------------------------
DELETE
Delete record from Supabase
   -------------------------- */
async function deleteRecord(tr) {
const id = tr.dataset.id;
if (!confirm(`Are you sure you want to delete record #${id}? This action cannot be undone.`)) return;

try {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
    if (error) throw error;

    await loadRecords();
    alert("Record deleted.");
} catch (err) {
    console.error("Error deleting:", err);
    alert("Could not delete record.");
}
}

/* --------------------------
CSV IMPORT
- Uses PapaParse if loaded (recommended)
- Falls back to a simple parser if not
- Inserts in chunks to avoid payload limits
   -------------------------- */
csvFileInput?.addEventListener("change", handleCsvFile);

async function handleCsvFile(ev) {
const file = ev.target.files[0];
if (!file) return;

if (!file.name.toLowerCase().endsWith(".csv")) {
    alert("Please select a CSV file (.csv).");
    csvFileInput.value = "";
    return;
}

if (!confirm(`Import CSV file: "${file.name}" ?\nThis will insert records into the database.`)) {
    csvFileInput.value = "";
    return;
}

  // Read file and parse rows
try {
    const text = await file.text();

    let rows = [];
    if (window.Papa) {
      // Use PapaParse if available — parse with header detection if first row contains names
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    if (parsed.errors && parsed.errors.length) {
        console.warn("PapaParse errors:", parsed.errors);
    }
      // parsed.data is array of objects with keys from header
      // Normalize to expected fields
    rows = parsed.data.map(r => normalizeCsvRowObject(r));
    } else {
      // simple fallback parser (expects either header or columns in order: nombre,email,age,phone)
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    if (lines.length <= 1) {
        alert("CSV seems empty or malformed.");
        return;
    }
      // detect header
    const firstCols = lines[0].split(",").map(c => c.trim().toLowerCase());
    const hasHeader = firstCols.includes("email") || firstCols.includes("nombre") || firstCols.includes("name");
    if (hasHeader) {
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        rows = lines.slice(1).map(line => {
        const cols = line.split(",").map(c => c.trim());
        const obj = {};
        headers.forEach((h, i) => obj[h] = cols[i] ?? "");
        return normalizeCsvRowObject(obj);
        });
    } else {
        // assume fixed order: nombre,email,age,phone
        rows = lines.map(line => {
        const cols = line.split(",").map(c => c.trim());
        return {
            nombre: cols[0] ?? "",
            email: cols[1] ?? "",
            age: Number.isFinite(+cols[2]) ? parseInt(cols[2], 10) : null,
            phone: cols[3] ?? ""
        };
        });
    }
    }

    // Filter and validate rows
    const validRows = rows.filter(r => {
    return r.nombre && r.email && Number.isInteger(r.age) && r.age > 0 && r.phone;
    });

    if (validRows.length === 0) {
    alert("No valid rows found in CSV (need nombre,email,age,phone).");
    return;
    }

    // Insert in chunks
    for (let i = 0; i < validRows.length; i += CSV_INSERT_CHUNK) {
    const chunk = validRows.slice(i, i + CSV_INSERT_CHUNK);
    const { error } = await supabase.from(TABLE_NAME).insert(chunk);
    if (error) {
        console.error("Error inserting chunk:", error);
        alert("Error inserting CSV chunk: " + (error.message || JSON.stringify(error)));
        return;
    }
    }

    alert(`CSV imported successfully: ${validRows.length} rows inserted.`);
    csvFileInput.value = "";
    await loadRecords();
} catch (err) {
    console.error("CSV import error:", err);
    alert("Error processing CSV. See console for details.");
}
}

/**
 * Normalize different CSV shapes into DB-ready object
 * Accepts object with various keys (nombre/name, email, age, phone/telefono)
 */
function normalizeCsvRowObject(obj) {
  // lower-case keys
const o = {};
for (const k in obj) {
    o[k.toLowerCase().trim()] = obj[k];
}
const nombre = o.nombre ?? o.name ?? o.fullname ?? o["first name"] ?? "";
const email = o.email ?? o.mail ?? "";
let age = o.age ?? o.edad ?? o["years"] ?? null;
if (typeof age === "string") age = age.trim() === "" ? null : parseInt(age, 10);
const phone = o.phone ?? o.telefono ?? o.tel ?? "";

return {
    nombre: (nombre || "").toString().trim(),
    email: (email || "").toString().trim(),
    age: Number.isInteger(+age) ? parseInt(age, 10) : null,
    phone: (phone || "").toString().trim()
};
}

/* --------------------------
Small helpers
   -------------------------- */
function escapeHtml(str = "") {
return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function escapeHtmlAttr(str = "") {
return String(str)
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}



