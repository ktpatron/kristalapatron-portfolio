export default {
  name: 'certificate',
  title: 'Certificate / Award',
  type: 'document',
  fields: [
    { name: 'title', title: 'Certificate Title', type: 'string' },
    { name: 'issuer', title: 'Issuer (e.g., Mindbank Training)', type: 'string' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'link', title: 'Credential Link', type: 'url' },
    { name: 'order', title: 'Order', type: 'number', description: 'Used to sort the list (e.g., 1, 2)' }
  ]
}