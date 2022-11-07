# image-crawler-s3-transform

# 🚀 image-crawler will download an image using a URL or Data URL and upload it to an s3 bucket with a 20px placeholder version for the Nextjs image component. 🚀

https://github.com/coding-to-music/image-crawler-s3-transform

From / By https://github.com/larbisahli/image-crawler

## Environment variables:

```java
SPACES_BUCKET_NAME=?
SPACES_BUCKET_ENDPOINT=.digitaloceanspaces.com
SPACES_ACCESS_KEY_ID=?
SPACES_ACCESS_SECRET_KEY=?

```

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/image-crawler-s3-transform.git
git push -u origin main
```

## Usage with Next.js

image-crawler will download an image using a URL or Data URL and upload it to an
s3 bucket with a 20px placeholder version of the original image, and then we
will convert the 20px image to a base64 for the Nextjs image component
placeholder.

Download and upload an image using a url:

```javascript
// server.js

import UploadImageByUrl from './src/upload';

const PrintResults = async () => {
  const url = 'https://ae01.alicdn.com/kf/HTB13gJEKeGSBuNjSspbq6AiipXaM.jpg';
  const title = 'product image from ali express';

  const { image, placeholder, error } = await UploadImageByUrl(
    url,
    title
  );

  return { image, placeholder, error }
};

PrintResults();

// Print Results:
{
  image: {
    path: '/2021/7/product_image_from_ali_express_1625320790_utZlhTnHo.jpg',
    ETag: '"fa8bc66b3d45370d5997856fb07cef07"'
  },
  placeholder: {
    path: '/2021/7/product_image_from_ali_express_1625320790_utZlhTnHo_placeholder.jpg',
    ETag: '"22436eaa7cd6c1b0ee25ec171265dcbc"'
  },
  error: undefined
}

```

Using the placeholder in Nextjs Image component:

```typescript

// ImageComponent.ts
import Image, { ImageProps } from 'next/image';
import React, { memo, useEffect, useState } from 'react';

import { Logs } from '@/lib/index';

interface Props extends ImageProps {
  src: string;
}

const ImageComponent = (props: Props) => {
  // Show something while the placeholder is loading
  const [Base64Placeholder, setBase64Placeholder] =
    useState <
    string >
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+utrPQAJNQNlcqdyCgAAAABJRU5ErkJggg==';

  // src = '/2021/7/product_image_from_ali_express_1625320790_utZlhTnHo.jpg'

  useEffect(() => {
    async function toBase64() {
      const arr: string[] = props.src?.split('.');
      const IS_PROD = process.env.NODE_ENV === 'production';
      const URI = IS_PROD ? process.env.MEDIA_URL : process.env.MEDIA_URL_DEV;
      // URI = https://bucket-name.fra1.digitaloceanspaces.com
      const URL = arr ? `${URI}${arr[0]}_placeholder.${arr[1]}` : '';

      try {
        const data = await fetch(URL);
        const blob = await data.blob();
        return await new Promise((resolve) => {
          const reader = new window.FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            return resolve(base64data);
          };
        })
          .then((res: string) => {
            setBase64Placeholder(res);
            return res;
          })
          .catch((error) => {
            // log to sentry
            Logs({ message: 'ImageComponent /u', error });
          });
      } catch (error) {
        // log to sentry
        Logs({ message: 'ImageComponent /d', error });
      }
    }

    if (props.src) toBase64();
  }, [props.src]);

  return (
    <Image
      {...props}
      blurDataURL={Base64Placeholder}
      placeholder="blur"
      alt={props.alt ?? 'product-image'}
      className="object-cover"
      src={`${process.env.MEDIA_URL}${
        props.src ?? '/static/images/no-image-placeholder.svg'
      }`}
    />
  );
};

export default memo(ImageComponent);
```

First, install all dependencies for the project:

```bash
yarn install
```

Second, run the development server:

```bash
yarn dev
```
