/// <reference lib="webworker" />

// addEventListener('message', ({ data }) => {
//   const response = `worker response to ${data}`;
//   postMessage(response);
// });

/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  try {
    const { operation, payload, taskId } = data;
    let result;

    // Route to the appropriate function based on the operation type
    switch (operation) {
      case 'sort':
        result = sortArray(payload.array, payload.sortKey, payload.sortOrder);
        break;
      case 'filter':
        result = filterArray(payload.array, payload.criteria);
        break;
      case 'map':
        result = mapArray(payload.array, payload.transformation);
        break;
      case 'aggregate':
        result = aggregateArray(payload.array, payload.groupBy);
        break;
      case 'search':
        result = searchArray(payload.array, payload.query);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    // Send the result back to the main thread
    postMessage({
      status: 'success',
      operation,
      result,
      taskId,
    });
  } catch (error: any) {
    // Handle errors
    postMessage({
      status: 'error',
      error: error.message,
      taskId: data.taskId,
    });
  }
});

// Sort an array of objects by a specific key
function sortArray(array: any, sortKey: any, sortOrder = 'asc') {
  console.log(`Sorting array by ${sortKey} in ${sortOrder} order`);
  const result = [...array];

  return result.sort((a, b) => {
    let valueA = a[sortKey];
    let valueB = b[sortKey];

    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    // Perform comparison
    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// Filter an array based on criteria
function filterArray(array: any, criteria: any) {
  console.log(`Filtering array with criteria: ${JSON.stringify(criteria)}`);
  return array.filter((item: any) => {
    // Check all criteria conditions
    for (const key in criteria) {
      if (criteria.hasOwnProperty(key)) {
        const criteriaValue = criteria[key];

        // Handle different types of criteria
        if (typeof criteriaValue === 'object' && criteriaValue !== null) {
          // Handle range criteria (e.g., { age: { min: 18, max: 65 } })
          if (
            criteriaValue.min !== undefined &&
            item[key] < criteriaValue.min
          ) {
            return false;
          }
          if (
            criteriaValue.max !== undefined &&
            item[key] > criteriaValue.max
          ) {
            return false;
          }
          // Handle array criteria (e.g., { status: { in: ['active', 'pending'] } })
          if (criteriaValue.in && !criteriaValue.in.includes(item[key])) {
            return false;
          }
        } else {
          // Handle direct comparison (e.g., { status: 'active' })
          if (item[key] !== criteriaValue) {
            return false;
          }
        }
      }
    }
    return true;
  });
}

// Map array elements with a transformation function
function mapArray(array: any, transformation: any) {
  console.log(`Mapping array with transformation: ${transformation}`);
  return array.map((item: any) => {
    // Create a new object to avoid modifying the original
    const result = { ...item };

    // Apply the transformation logic (supports basic expressions)
    for (const key in transformation) {
      if (transformation.hasOwnProperty(key)) {
        const formula = transformation[key];

        // Handle simple math operations on properties
        if (typeof formula === 'string' && formula.includes('item.')) {
          // Very basic expression evaluation (only for demonstration)
          // In a real implementation, use a more robust approach or a library
          try {
            // Replace item.propertyName with actual values
            let jsExpression = formula;
            const propRegex = /item\.([a-zA-Z0-9_]+)/g;
            jsExpression = jsExpression.replace(propRegex, (match, prop) => {
              return JSON.stringify(item[prop]);
            });

            // Evaluate the resulting expression
            result[key] = eval(jsExpression);
          } catch (e) {
            result[key] = null;
          }
        } else {
          // Direct value assignment
          result[key] = formula;
        }
      }
    }
    return result;
  });
}

// Group and aggregate data
function aggregateArray(array: any, groupBy: any) {
  console.log(`Aggregating array by ${groupBy.field}`);
  const grouped: any = {};

  // Group the items
  array.forEach((item: any) => {
    const groupKey = item[groupBy.field];
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
  });

  // Apply aggregations to each group
  const result: any = [];
  for (const key in grouped) {
    if (grouped.hasOwnProperty(key)) {
      const group: any = grouped[key];
      const aggregated: any = { [groupBy.field]: key };

      // Apply requested aggregations
      if (groupBy.aggregations) {
        groupBy.aggregations.forEach((agg: any) => {
          const { field, type } = agg;

          switch (type) {
            case 'sum':
              aggregated[`${field}_sum`] = group.reduce(
                (sum: any, item: any) => sum + (Number(item[field]) || 0),
                0
              );
              break;
            case 'avg':
              aggregated[`${field}_avg`] =
                group.reduce(
                  (sum: any, item: any) => sum + (Number(item[field]) || 0),
                  0
                ) / group.length;
              break;
            case 'min':
              aggregated[`${field}_min`] = Math.min(
                ...group.map((item: any) => Number(item[field]) || 0)
              );
              break;
            case 'max':
              aggregated[`${field}_max`] = Math.max(
                ...group.map((item: any) => Number(item[field]) || 0)
              );
              break;
            case 'count':
              aggregated[`${field}_count`] = group.length;
              break;
          }
        });
      }

      result.push(aggregated);
    }
  }

  return result;
}

// Search array for items matching a query
function searchArray(array: any, query: any) {
  console.log(`Searching array for: ${query.term}`);
  const term = query.term.toLowerCase();
  const fields = query.fields || Object.keys(array[0] || {});

  return array.filter((item: any) => {
    return fields.some((field: any) => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      } else if (value !== null && value !== undefined) {
        // Try to convert to string and check
        return String(value).toLowerCase().includes(term);
      }
      return false;
    });
  });
}
