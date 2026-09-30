export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'role', title: 'Role/Job Title', type: 'string' },
    { name: 'company', title: 'Company Name', type: 'string' },
    { name: 'dateRange', title: 'Date Range', type: 'string', description: 'e.g., MAR 2026 - JUL 2026' },
    { 
      name: 'description', 
      title: 'Description (Bullet Points)', 
      type: 'array', 
      of: [{ type: 'string' }],
      description: 'Mag-add ng item para sa bawat bullet point.'
    },
    { name: 'order', title: 'Order', type: 'number', description: 'Used to sort the timeline (e.g., 1, 2, 3)' }
  ]
}