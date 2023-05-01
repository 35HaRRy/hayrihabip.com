
# How to use?

## Project naming

Starter comes up with it's own name, "hayrihabip.com". I'm sure this will not be the name for all of your project and you intend to change it with your project name. Follow this guide.

- You need to clone this repository.
- Find & replace the word "hayrihabip.com" with your project name.
- Update your root folder name.

## Running application
Application has three major build types:

- Non SSR
- SSR

### Non SSR

It is regular build without Angular Universal in picture.Use it for your day to day development since it is fairly fast as compared to SSR.

**Command**:
- `ng serve` - For local development build
- `ng build` - For production build

### SSR

This is Angular Universal build.

**Command**:
- `npm run dev:ssr` - For local development build
- `npm run build:ssr` - For production build
