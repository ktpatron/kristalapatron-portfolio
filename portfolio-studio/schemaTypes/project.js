export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Project Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle / Short Description', type: 'string' },
    { 
      name: 'category', 
      title: 'Category', 
      type: 'string',
      options: {
        list: [
          { title: 'Ecosystems', value: 'ecosystems' },
          { title: 'Automation', value: 'automation' },
          { title: 'Web Design', value: 'web-design' },
          { title: 'Graphic Design', value: 'graphic-design' },
          { title: 'Live Website', value: 'live-website' }
        ]
      }
    },
    { name: 'tags', title: 'Tags/Tech Stack', type: 'string' },
    { name: 'link', title: 'Project Link', type: 'url' },
    
    // 4 Images
    { name: 'image1', title: 'Main Image 1', type: 'image', options: { hotspot: true } },
    { name: 'image2', title: 'Thumbnail 2', type: 'image', options: { hotspot: true } },
    { name: 'image3', title: 'Thumbnail 3', type: 'image', options: { hotspot: true } },
    { name: 'image4', title: 'Thumbnail 4', type: 'image', options: { hotspot: true } },

    // BAGONG FIELD PARA SA SORTING
    { 
      name: 'order', 
      title: 'Order', 
      type: 'number', 
      description: 'Ilagay ang 1 para sa pinakaunang project, 2 sa susunod, etc.' 
    }
  ]
}