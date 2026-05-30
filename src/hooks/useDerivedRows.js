import { useMemo } from 'react';

// Applies text/numeric filters then multi-column sort. Memoized on inputs.
export function useDerivedRows(rows, filters, sorts, columns) {
  return useMemo(() => {
    const colByKey = Object.fromEntries(columns.map((c) => [c.key, c]));

    // ---- FILTER ----
    const activeFilters = Object.entries(filters).filter(([, v]) => v != null && v !== '');
    let result = rows;

    if (activeFilters.length) {
      result = rows.filter((row) =>
        activeFilters.every(([key, raw]) => {
          const col = colByKey[key];
          const cell = row[key];
          if (col?.type === 'number') {
            // supports >, <, >=, <=, = and plain "contains" numeric
            const m = String(raw).trim().match(/^(>=|<=|>|<|=)?\s*(-?\d+\.?\d*)$/);
            if (!m) return String(cell).includes(String(raw).trim());
            const op = m[1] || '=';
            const num = parseFloat(m[2]);
            switch (op) {
              case '>': return cell > num;
              case '<': return cell < num;
              case '>=': return cell >= num;
              case '<=': return cell <= num;
              default: return cell === num;
            }
          }
          return String(cell).toLowerCase().includes(String(raw).toLowerCase());
        })
      );
    }

    console.log(sorts, 'sorts');

    // ---- SORT (multi-column, stable) ----
    if (sorts.length) {
      result = result.slice().sort((a, b) => {
        for (const { key, dir } of sorts) {
          const col = colByKey[key];
          let av = a[key];
          let bv = b[key];
          let cmp;
          if (col?.type === 'number') {
            cmp = av - bv;
          } else {
            cmp = String(av).localeCompare(String(bv));
          }
          if (cmp !== 0) return dir === 'asc' ? cmp : -cmp;
        }
        return 0;
      });
    }

    return result;
  }, [rows, filters, sorts, columns]);
}
