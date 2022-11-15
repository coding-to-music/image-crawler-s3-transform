// server.js

import UploadImageByUrl from './src/upload';

const PrintResults = async () => {
  const url = 'https://ae01.alicdn.com/kf/HTB13gJEKeGSBuNjSspbq6AiipXaM.jpg';
  const title = 'product image from ali express';

  const { image, placeholder, error } = await UploadImageByUrl(url, title);

  return { image, placeholder, error };
};

PrintResults();

// Print Results:
// {
//   image: {
//     path: '/2021/7/product_image_from_ali_express_1625320790_utZlhTnHo.jpg',
//     ETag: '"fa8bc66b3d45370d5997856fb07cef07"'
//   },
//   placeholder: {
//     path: '/2021/7/product_image_from_ali_express_1625320790_utZlhTnHo_placeholder.jpg',
//     ETag: '"22436eaa7cd6c1b0ee25ec171265dcbc"'
//   },
//   error: undefined
// }
