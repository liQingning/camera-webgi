# WebGi vivox200ultra 产品页面
借鉴了项目: [camera-webgi](https://github.com/ektogamat/camera-webgi),使用 Gsap、ScrollTrigger 和 webgi 引擎构建可滚动页面。


<img src="assets/images/屏幕截图.jpg" width="100%" />

## Running
First install the dependencies:
```bash
npm install
```

To run the project in development mode:
```bash
npm run dev
```
Then navigate to [http://localhost:5173/index.html](http://localhost:5173/index.html) in a web browser to see the default scene in a viewer.

The assets are stored in the `assets` directory.

To build the project for production:
```bash
npm run build
```

## Updates
Check the [webgi manual](https://webgi.xyz/docs/manual/#sdk-links) for the latest version.
To use the different version:
* Update the version number in `package.json` file for both `webgi` and `@types/webgi`.
* Run `npm install` to update the dependencies.
* Run `npm run dev` or `npm run build` to run or build the project.

## Documentation
For the latest version and documentation: [WebGi Docs](https://webgi.xyz/docs/).

## License 
For license and terms of use, see the [SDK License](https://webgi.xyz/docs/license).
