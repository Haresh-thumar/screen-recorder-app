/// <reference lib="webworker" />

// addEventListener('message', ({ data }) => {
//   const response = `worker response to ${data}`;
//   postMessage(response);
// });

addEventListener('message', ({ data }) => {
  try {
    const { array, sortKey, sortOrder } = data;

    // Perform the sort operation
    const sortedArray = sortArrayOfObjects(array, sortKey, sortOrder);

    // Send the sorted array back to the main thread
    postMessage({
      status: 'success',
      result: sortedArray,
    });

    // Optional: Clean up after sending the result
    // close(); // Uncomment if you want the worker to terminate itself after sorting
  } catch (error: any) {
    // Handle any errors
    postMessage({
      status: 'error',
      error: error.message,
    });
  }
});

/**
 * Sort an array of objects by a specified key
 * @param array The array of objects to sort
 * @param sortKey The object property to sort by
 * @param sortOrder The sort direction ('asc' or 'desc')
 * @returns The sorted array
 */
function sortArrayOfObjects(array: any, sortKey: any, sortOrder = 'asc') {
  // Create a copy of the array to avoid modifying the original
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
