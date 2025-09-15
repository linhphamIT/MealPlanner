export const toTitleCaseFromSnakeCase = (str: string | null | undefined) => { // Allow null/undefined
  if (!str) { // Check if str is null, undefined, or empty
    return ''; // Return empty string or a default like 'N/A'
  }
  return str.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};