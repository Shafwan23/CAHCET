/**
 * Recursively compares two JSON objects and returns an array of changes.
 * Output format: [{ path: 'hero.title', oldValue: 'A', newValue: 'B', type: 'MODIFIED' }]
 */
export const diffJSON = (oldObj, newObj, path = '') => {
  let changes = [];
  
  const oldParsed = typeof oldObj === 'string' ? safeParse(oldObj) : (oldObj || {});
  const newParsed = typeof newObj === 'string' ? safeParse(newObj) : (newObj || {});

  const allKeys = new Set([...Object.keys(oldParsed), ...Object.keys(newParsed)]);

  allKeys.forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    const oldVal = oldParsed[key];
    const newVal = newParsed[key];

    if (oldVal === undefined && newVal !== undefined) {
      changes.push({ path: currentPath, oldValue: null, newValue: newVal, type: 'ADDED' });
    } else if (oldVal !== undefined && newVal === undefined) {
      changes.push({ path: currentPath, oldValue: oldVal, newValue: null, type: 'REMOVED' });
    } else if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      // Handle Arrays intelligently
      // Try to match by 'id' if objects
      const oldById = {};
      const newById = {};
      let hasIds = false;
      
      oldVal.forEach((item, i) => { if (item && item.id) { oldById[item.id] = item; hasIds = true; } });
      newVal.forEach((item, i) => { if (item && item.id) { newById[item.id] = item; hasIds = true; } });

      if (hasIds) {
        // Diff by ID
        const allIds = new Set([...Object.keys(oldById), ...Object.keys(newById)]);
        allIds.forEach(id => {
          const o = oldById[id];
          const n = newById[id];
          const itemPath = `${currentPath}[id:${id}]`;
          if (!o && n) changes.push({ path: itemPath, oldValue: null, newValue: n, type: 'ADDED' });
          else if (o && !n) changes.push({ path: itemPath, oldValue: o, newValue: null, type: 'REMOVED' });
          else {
            const nested = diffJSON(o, n, itemPath);
            changes = changes.concat(nested);
          }
        });
      } else {
        // Fallback: full replacement if stringified differs
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          changes.push({ path: currentPath, oldValue: oldVal, newValue: newVal, type: 'MODIFIED' });
        }
      }
    } else if (isObject(oldVal) && isObject(newVal)) {
      changes = changes.concat(diffJSON(oldVal, newVal, currentPath));
    } else if (oldVal !== newVal) {
      changes.push({ path: currentPath, oldValue: oldVal, newValue: newVal, type: 'MODIFIED' });
    }
  });

  return changes;
};

const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return { text: str };
  }
};
