// CSV export of the currently-derived (filtered + sorted) rows.
export function exportToCsv(filename, columns, rows) {
  const header = columns.map((c) => `"${c.label}"`).join(',');
  const escape = (val) => {
    const s = val == null ? '' : String(val);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const body = rows
    .map((row) => columns.map((c) => escape(row[c.key])).join(','))
    .join('\n');

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
