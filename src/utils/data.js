// Synthetic dataset generator — produces 10,000+ rows deterministically-ish.

const FIRST = ['Ada', 'Linus', 'Grace', 'Alan', 'Margaret', 'Dennis', 'Barbara', 'Ken',
  'Radia', 'Donald', 'Frances', 'Edsger', 'Hedy', 'Tim', 'Shafi', 'Vint', 'Karen', 'Brian',
  'Sophie', 'Guido', 'Anita', 'James', 'Carla', 'Niklaus', 'Leslie', 'Ravi', 'Mei', 'Yuki'];
const LAST = ['Lovelace', 'Torvalds', 'Hopper', 'Turing', 'Hamilton', 'Ritchie', 'Liskov',
  'Thompson', 'Perlman', 'Knuth', 'Allen', 'Dijkstra', 'Lamarr', 'Berners-Lee', 'Goldwasser',
  'Cerf', 'Sparck', 'Kernighan', 'Wilson', 'van Rossum', 'Borg', 'Gosling', 'Meyer', 'Wirth'];
const DEPTS = ['Engineering', 'Design', 'Research', 'Sales', 'Operations', 'Finance', 'Support', 'Legal'];
const STATUSES = ['Active', 'On Leave', 'Remote', 'Contract'];

function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function generateRows(count = 10000) {
  const r = rng(42);
  const rows = new Array(count);
  for (let i = 0; i < count; i++) {
    const first = FIRST[Math.floor(r() * FIRST.length)];
    const last = LAST[Math.floor(r() * LAST.length)];
    const dept = DEPTS[Math.floor(r() * DEPTS.length)];
    rows[i] = {
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}@aperture.io`,
      department: dept,
      status: STATUSES[Math.floor(r() * STATUSES.length)],
      salary: 45000 + Math.floor(r() * 180000),
      quantity: 1 + Math.floor(r() * 500),
      rating: Math.round((1 + r() * 4) * 10) / 10,
    };
  }
  console.log(rows, 'rows')
  return rows;
}

// Column definitions drive the whole table (render, edit, sort, filter, export).
export const COLUMNS = [
  { key: 'id', label: 'ID', type: 'number', width: 80, editable: false, align: 'right' },
  { key: 'name', label: 'Name', type: 'text', width: 200, editable: true },
  { key: 'email', label: 'Email', type: 'text', width: 280, editable: true },
  { key: 'department', label: 'Department', type: 'text', width: 150, editable: true },
  { key: 'status', label: 'Status', type: 'text', width: 130, editable: true },
  { key: 'salary', label: 'Salary', type: 'number', width: 140, editable: true, align: 'right', format: (v) => `$${Number(v).toLocaleString()}` },
  { key: 'quantity', label: 'Qty', type: 'number', width: 100, editable: true, align: 'right' },
  { key: 'rating', label: 'Rating', type: 'number', width: 110, editable: true, align: 'right' },
];
