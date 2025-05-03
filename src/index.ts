import {
    ViewerApp,
    AssetManagerPlugin,
    timeout,
    SSRPlugin,
    mobileAndTabletCheck,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSAOPlugin,
    GroundPlugin,
    FrameFadePlugin,DiamondPlugin,
    BloomPlugin, TemporalAAPlugin, RandomizedDirectionalLightPlugin, AssetImporter, createStyles,
    addBasePlugins,PickingPlugin,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin, FileTransferPlugin,
} from "webgi"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother"
console.log(gsap)

import "./styles.css"

gsap.registerPlugin(ScrollTrigger,ScrollSmoother)

let needsUpdate = true;
async function setupViewer(){

    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: true,          // 启用HDR编码
        useGBufferDepth: true,  // 启用深度缓冲
    })
    const isMobile = mobileAndTabletCheck()//检测是否为移动端

    viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1)
    //在高DPI设备上适当降低渲染分辨率，平衡画质与性能

    //加载资源管理器
    const manager = await viewer.addPlugin(AssetManagerPlugin) as AssetManagerPlugin;
    const camera = viewer.scene.activeCamera
    const position = camera.position//摄像机三维坐标
    const target = camera.target//摄像机焦点坐标

    // 引入元素
    const exploreView = document.querySelector('.cam-view-5') as HTMLElement
    const canvasView = document.getElementById('webgi-canvas') as HTMLElement
    const canvasContainer = document.getElementById('webgi-canvas-container') as HTMLElement
    const exitContainer = document.querySelector('.exit--container') as HTMLElement
    const loaderElement = document.querySelector('.loader') as HTMLElement
    const header = document.querySelector('.header') as HTMLElement
    const bodyButton =  document.querySelector('.button--body') as HTMLElement

    // 添加webgi插件
    await addBasePlugins(viewer)
    await viewer.addPlugin(FileTransferPlugin)
    await viewer.addPlugin(CanvasSnipperPlugin)
    // await viewer.addPlugin(TonemapPlugin);
    // await viewer.addPlugin(GroundPlugin);
    // await viewer.addPlugin(GBufferPlugin);
    

    // WEBGi loader
    const importer = manager.importer as AssetImporter


    //显示加载进度条
    importer.addEventListener("onProgress", (ev) => {
        const progressRatio = (ev.loaded / ev.total)
        document.querySelector('.progress')?.setAttribute('style',`transform: scaleX(${progressRatio})`)
    })

    //加载完成后出发动画
    importer.addEventListener("onLoad", (ev) => {
        introAnimation()
    })
    viewer.renderer.refreshPipeline()

    //加载模型
    const assets = await manager.addFromPath("/assets/scene (24).glb");


    //禁用用户控制
    if(camera.controls) camera.controls.enabled = false

    // WEBGi 移动端适配
    if(isMobile){
        camera.setCameraOptions({fov:65})
    }

    window.scrollTo(0,0)//页面强制滚动到顶部

    await timeout(50) //等待时间


    //开场动画
    function introAnimation(){
        const introTL = gsap.timeline()
        introTL
        .to('.loader', {x: '150%', duration: 0.8, ease: "power4.inOut", delay: 1})
        .fromTo(position, {x: -0.637, y: 0.7, z: 10.64}, {x: 3.51, y: 0.618, z: 10.14, duration: 4, onUpdate}, '-=0.8')
        .fromTo(target, {x: -5.04, y: 0.174, z: 2.3}, {x: -1.588, y: 0.012, z: 0.5, duration: 4, onUpdate}, '-=4')
        .fromTo('.header--container', {opacity: 0, y: '-100%'}, {opacity: 1, y: '0%', ease: "power1.inOut", duration: 0.8}, '-=1')
        .fromTo('.hero--scroller', {opacity: 0, y: '150%'}, {opacity: 1, y: '0%', ease: "power4.inOut", duration: 1}, '-=1')
        .fromTo('.hero--content', {opacity: 0, x: '-50%'}, {opacity: 1, x: '0%', ease: "power4.inOut", duration: 1.8, onComplete: setupScrollAnimation}, '-=1')
    }


    function setupScrollAnimation(){
        document.body.style.overflowY = "scroll"
        document.body.removeChild(loaderElement)
        document.body.style.overflow = 'hidden';
        // 背景 smoother
        const backgroundSections = gsap.utils.toArray(".background")
        const smootherBG = (window as any).ScrollSmoother.create({
            wrapper: "#smooth-wrapper2",
            content: "#smooth-content2",
            smooth: 1.5,
            normalizeScroll: true,
            effects: true, // 背景不需要额外特效
            preventDefault: true
        })

        //前景smoother
        const sections = gsap.utils.toArray(".section")
        
        const smoother = (window as any).ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.5,
            effects: true,
            ignoreMobileResize: true, 
            normalizeScroll: true,    
            snap: {
              snapTo: "labels", // 总共有两屏 cam-view-1 和 cam-view-2，所以 snapTo = 1/(2-1) = 1
              duration: 0.6,
              ease: "power1.inOut"
            }
        })
        
        const clickbutton= document.querySelector('.button button-know-more') as HTMLElement



        // 第一部分到第二部分
        ScrollTrigger.create({
            trigger: ".cam-view-2",
            start: "top bottom",
            end: "top top",

            onUpdate: self => {
                const p = self.progress
                position.set(
                    lerp(3.51, 1.59, p),
                    lerp(0.618, -0.42, p),
                    lerp(10.14, -8.369, p)
                )
                target.set(
                    lerp(-1.588, -1.58, p),
                    lerp(0.012, 0.012, p),
                    lerp(0.5, 0.49, p)
                )
                   
                const textEl = document.querySelector('.hero--content') as HTMLElement
                if (textEl) {
                    textEl.style.opacity = `${lerp(1,0,p*3)}`
                    textEl.style.transform = `translateX(${-p * 400}px) translateY(${p *  window.innerHeight}px)`  
                }
                const textE2 = document.querySelector('.hero--scroller--container') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(1,0,p)}`
                    textE2.style.transform = `translateY(${p *  window.innerHeight*1.5}px)`       
                }
                const textE3 = document.querySelector('.video--content') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(0,1,p)}`
                    textE3.style.transform = `translateX(${-p * 400}px) translateY(${p *  window.innerHeight}px)`  
                }
                const textE4 = document.querySelector('.view1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(1,0,p)}` 
                    // textE4.style.transform = `translateY(${-p *  window.innerHeight}px)` 
                }
                const textE5 = document.querySelector('.view2') as HTMLElement
                if (textE5) {
                    textE5.style.opacity = `${lerp(0,1,p)}` 
                    // textE5.style.transform = `translateY(${-p *  window.innerHeight}px)` 
                }

                onUpdate()
            }
        })

        //视频播放部分
        const coverImage = document.getElementById('cover-image') as HTMLImageElement;
        const fullscreenVideo = document.getElementById('fullscreen-video') as HTMLElement;
        const videoPlayer = document.getElementById('video-player') as HTMLVideoElement;
        const loadingSpinner = document.getElementById('loading-spinner') as HTMLElement;
        const exitButton = document.getElementById('exit-button') as HTMLElement;

        coverImage.addEventListener('click', () => {
            fullscreenVideo.style.display = 'flex'; // 显示全屏视频层
            videoPlayer.play();                     // 开始播放视频
        })

        // 点击退出按钮
        exitButton.addEventListener('click', () => {
            exitFullscreenVideo();
        })
        
        // 播放结束也退出
        videoPlayer.addEventListener('ended', () => {
            exitFullscreenVideo();
        })
        // 退出函数（统一处理）
        function exitFullscreenVideo() {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.style.opacity = '0';
            setTimeout(() => {
            fullscreenVideo.style.display = 'none';
            }, 800);
        }
        
        //第二部分到第三部分
        ScrollTrigger.create({
            trigger: ".cam-view-3",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                
                viewer.scene.children.forEach((obj: any) => {
                  
                    obj.rotation.z = lerp(0,Math.PI/2,p);  // 将 z 轴的旋转角度加上 90°（Math.PI / 2）
                });

                position.set(
                    lerp(1.59,-0.16, p),
                    lerp(-0.42,-0.41, p),
                    lerp(-8.369,-8.38, p)
                )
                target.set(
                    lerp(-1.58,0.03, p),
                    lerp(0.012, 0.037,p),
                    lerp(0.49, 1,p)
                )
                const textEl = document.querySelector('.view2') as HTMLElement
                if (textEl) {
                    textEl.style.opacity = `${lerp(1,0,p)}` 
                }
                const textE2 = document.querySelector('.view3') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(0,1,p)}`
                }

                const textE3 = document.querySelector('.design--content1') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(0,1,p)}`
                    textE3.style.transform = `translateX(${p * 400}px) `  
                }
                const textE4 = document.querySelector('.video--content') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(1,0,p)}`
                }
                const textE5 = document.querySelector('.design--container2') as HTMLElement
                if (textE5) {
                    textE5.style.opacity = `${lerp(0,1,p)}`
                    textE5.style.transform = `translateX(${-p * 400}px) `  
                }
                onUpdate()
            }
        })

        //第三部分到第四部分
        ScrollTrigger.create({
            trigger: ".cam-view-4",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                const gray = Math.round(lerp(239, 0, p));
                document.body.style.backgroundColor = `rgb(${gray}, ${gray}, ${gray})`;//背景变黑
                position.set(
                    lerp(-0.16,-0.826, p),
                    lerp(-0.41,-4.11, p),
                    lerp(-8.38,-1.57, p)
                )
                target.set(
                    lerp(0.03,-0.83, p),
                    lerp(0.037, 0.886,p),
                    lerp(1, -0.018,p)
                )

                const textE1 = document.querySelector('.view3') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(1,0,p)}`
                }

                const textE2 = document.querySelector('.design--content1') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(1,0,p)}`
                    textE2.style.transform = `translateX(${p * 400+400}px) `  
                }

                const textE3 = document.querySelector('.design--container2') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(1,0,p)}`
                    textE3.style.transform = `translateX(${-p * 400-400}px) `  
                }
                const textE4 = document.querySelector('.view4--content1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(0,1,(p-0.5)*2)}` 
                }
                const textE5 = document.querySelector('.view4--line') as HTMLElement
                if (textE5) {
                    textE5.style.opacity = `${lerp(0,1,(p-0.5)*2)}`
                    const height = lerp(0, 270, (p-0.5)*2);
                    textE5.style.height = `${height}px`;
                    textE5.style.transform = `translateY(${270 - height}px)`;  
                }
                
                onUpdate()
            }
        })

        //第四部分到第五部分
        ScrollTrigger.create({
            trigger: ".cam-view-5",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                const textE1 = document.querySelector('.view4--content1') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(1,0,p*2)}`
                    textE1.style.transform=`translateY(${p*window.innerHeight}px)`
                }
                const textE2 = document.querySelector('.view5--content1') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(0,1,p)}`
                    textE2.style.transform=`translateY(${(p-1)*window.innerHeight}px)`
                }
                const textE3 = document.querySelector('.view5--line') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(0,1,p)}`
                    const height = lerp(0, 270, p);
                    textE3.style.height = `${height}px`;
                    textE3.style.transform = `translateY(${270 - height+(p-1)*window.innerHeight}px)`;  
                }
                const textE4 = document.querySelector('.view4--line') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(1,0,p*2)}`
                    const height = lerp(270,0, p*2);
                    textE4.style.height = `${height}px`;
                    textE4.style.transform = `translateY(${270 - height+p*window.innerHeight}px)`;  
                }


                onUpdate()
            }
        })

        //第五部分到第六部分
        ScrollTrigger.create({
            trigger: ".cam-view-6",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                const textE1 = document.querySelector('.view5--content1') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(1,0,p*2)}`
                    textE1.style.transform=`translateY(${p*window.innerHeight}px)`
                }
                const textE2 = document.querySelector('.view5--line') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(1,0,p*2)}`
                    const height = lerp(270,0, p*2);
                    textE2.style.height = `${height}px`;
                    textE2.style.transform = `translateY(${270 - height+p*window.innerHeight}px)`;  
                }

                const textE3 = document.querySelector('.view6--line') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(0,1,p)}`
                    const height = lerp(0, 270, p);
                    textE3.style.height = `${height}px`;
                    textE3.style.transform = `translateY(${270 - height+(p-1)*window.innerHeight}px)`;  
                }                
                const textE4 = document.querySelector('.view6--content1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(0,1,p)}`
                    textE4.style.transform=`translateY(${(p-1)*window.innerHeight}px)`
                }
                onUpdate()
            }
        })

        //第六部分到第七部分
        ScrollTrigger.create({
            trigger: ".cam-view-7",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                const white = Math.round(lerp(0,239,  p));
                document.body.style.backgroundColor = `rgb(${white}, ${white}, ${white})`;//背景变白
                position.set(
                    lerp(-0.826,-0.36, p),
                    lerp(-4.11,-1.227 ,p),
                    lerp(-1.57, -0.215,p)
                )
                target.set(
                    lerp(-0.83,-0.357, p),
                    lerp(0.886,0.89,p),
                    lerp(-0.018,-0.04,p)
                )

                const textE1 = document.querySelector('.view6--content1') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(1,0,p*2)}`
                    textE1.style.transform=`translateY(${p*window.innerHeight}px)`
                }
                const textE2 = document.querySelector('.view6--line') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(1,0,p*2)}`
                    const height = lerp(270,0, p*2);
                    textE2.style.height = `${height}px`;
                    textE2.style.transform = `translateY(${270 - height+p*window.innerHeight}px)`;  
                }
                const textE3 = document.querySelector('.view7') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(0,1,p)}`
                }
                const textE4 = document.querySelector('.view7--container1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(0,1,p)}`
                    textE4.style.transform=` translateX(${p * 400}px) translateY(${(p-1)*window.innerHeight}px)`
                }

                onUpdate()
            }
        })

        //第七部分到第八部分
        ScrollTrigger.create({
            trigger: ".cam-view-8",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                viewer.scene.children.forEach((obj: any) => {
                    obj.rotation.z = lerp(Math.PI/2,0,p);  // 将 z 轴的旋转角度减 90°（Math.PI / 2）
                });
                
                position.set(
                    lerp(-0.36,0.0, p),
                    lerp(-1.227,-2.39 ,p),
                    lerp( -0.215,-1.8,p)
                )
                target.set(
                    lerp(-0.357,0.0, p),
                    lerp(0.89,0.677,p),
                    lerp(-0.04,-0.38,p)
                )


                const textE1 = document.querySelector('.view7') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(1,0,p)}`
                }
                const textE2 = document.querySelector('.view7--container1') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(1,0,p)}`
                    textE2.style.transform=` translateX(${-p * 400+400}px) translateY(${p*window.innerHeight}px)`
                }
                const textE3 = document.querySelector('.view8') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(0,1,p)}`
                    if(p==1){
                        textE3.style.opacity='1';
                    }
                }
                const textE4 = document.querySelector('.view8--container1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(0,1,p)}`
                    textE4.style.transform=`translateY(${p*400+(p-1)*window.innerHeight}px)`
                }
                const textE5 = document.querySelector('.view8--content2') as HTMLElement
                if (textE5) {
                    if(p<=0.9){
                        textE5.style.opacity='0'
                    }
                    
                }
                onUpdate()
            }
        })

        //第八部分到第九部分
        ScrollTrigger.create({
            trigger: ".cam-view-9",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                const gray = Math.round(lerp(239, 0, p));
                document.body.style.backgroundColor = `rgb(${gray}, ${gray}, ${gray})`;//背景变黑
                position.set(
                    lerp(0.0,2.64, p),
                    lerp(-2.39,-0.9,p),
                    lerp(-1.8,0.1,p)
                )
                target.set(
                    lerp(0.0,-1.8, p),
                    lerp(0.677,-0.9,p),
                    lerp(-0.38,-0.9,p)
                )
                const textE1 = document.querySelector('.view8') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(1,0,p)}`
                }
                const textE2 = document.querySelector('.view8--container1') as HTMLElement
                if (textE2) {
                    textE2.style.opacity='1'
                    textE2.style.opacity = `${lerp(1,0,p)}`
                }
                const textE3 = document.querySelector('.view8--content2') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(1,0,p)}`
                }
                const textE4 = document.querySelector('.view9--container1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(0,1,p)}`
                    textE4.style.transform = `translateX(${-p * 400}px) translateY(${(p-1) *  window.innerHeight}px)` 
                }
                const textE5 = document.querySelector('.view9') as HTMLElement
                if (textE5) {
                    textE5.style.opacity = `${lerp(0,1,p)}`
                }
                
                onUpdate()
            }
        })

        //第九部分到第十部分
        ScrollTrigger.create({
            trigger: ".cam-view-10",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                const gray = Math.round(lerp(0,239, p));
                document.body.style.backgroundColor = `rgb(${gray}, ${gray}, ${gray})`;//背景变白
                position.set(
                    lerp(2.64,2.39, p),
                    lerp(-0.9,0.226,p),
                    lerp(0.1,9,p)
                )
                target.set(
                    lerp(-1.8,-1.5, p),
                    lerp(-0.9,0.0337,p),
                    lerp(-0.9,0.45,p)
                )
                const textE1 = document.querySelector('.view9') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(1,0,p)}`
                }
                const textE2 = document.querySelector('.view9--container1') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(1,0,p)}`
                    textE2.style.transform = `translateX(${p * 800-400}px) translateY(${p *  window.innerHeight}px)` 
                }
                const textE3 = document.querySelector('.view10') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(0,1,p)}`
                }
                const textE4 = document.querySelector('.view10--container1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(0,1,p)}`
                    textE4.style.transform = `translateX(${p * 400}px) translateY(${(p-1) *  window.innerHeight}px)` 
                }
                const textE5 = document.querySelector('.view10--container2 h1') as HTMLElement
                if (textE5) {
                    textE5.style.opacity = `${lerp(0,1,(p-0.2)*1.25)}`
                    textE5.style.transform = `translateX(${(p-0.2)*1.25 * 400}px) translateY(${(p-1) *  window.innerHeight}px)` 
                }
                const textE6 = document.querySelector('.view10--content1') as HTMLElement
                if (textE6) {
                    textE6.style.opacity = `${lerp(0,1,(p-0.4)*1.666)}`
                    textE6.style.transform = `translateX(${(p-0.4)*1.666 * 800}px) translateY(${(p-1) *  window.innerHeight}px)` 
                }
                const textE7 = document.querySelector('.view10--content2') as HTMLElement
                if (textE7) {
                    textE7.style.opacity = `${lerp(0,1,(p-0.6)*2.5)}`
                    textE7.style.transform = `translateX(${(p-0.6)*2.5 * 800}px) translateY(${(p-1) *  window.innerHeight}px)` 
                }
                const textE8 = document.querySelector('.view10--content3') as HTMLElement
                if (textE8) {
                    textE8.style.opacity = `${lerp(0,1,(p-0.8)*5)}`
                    textE8.style.transform = `translateX(${(p-0.8)*5 * 800}px) translateY(${(p-1) *  window.innerHeight}px)` 
                }
                onUpdate()
            }
        })

        //第十部分到第十一部分
        ScrollTrigger.create({
            trigger: ".cam-view-11",
            start: "top bottom",
            end: "top top",
            onUpdate: self => {
                const p = self.progress;
                position.set(
                    lerp(2.39,1.61, p),
                    lerp(0.226,-0.09,p),
                    lerp(9,-8.37,p)
                )
                target.set(
                    lerp(-1.5,-1.588,p),
                    lerp(0.0337,0.012,p),
                    lerp(0.45,0.5,p)
                )
                const textE1 = document.querySelector('.view11--container1') as HTMLElement
                if (textE1) {
                    textE1.style.opacity = `${lerp(0,1,(p-0.5)*2)}`
                    textE1.style.transform = `translateX(${-(p-0.5)*2 * 400}px) translateY(${(p-1) *  window.innerHeight}px)` 
                }
                const textE2 = document.querySelector('.view11') as HTMLElement
                if (textE2) {
                    textE2.style.opacity = `${lerp(0,1,p)}`
                }
                const textE3 = document.querySelector('.view10') as HTMLElement
                if (textE3) {
                    textE3.style.opacity = `${lerp(1,0,p)}`
                }
                const textE4 = document.querySelector('.view10--container1') as HTMLElement
                if (textE4) {
                    textE4.style.opacity = `${lerp(1,0,p)}`
                    textE4.style.transform = `translateX(${-p * 400+400}px) translateY(${p *  window.innerHeight}px)` 
                }
                const textE5 = document.querySelector('.view10--container2 h1') as HTMLElement
                if (textE5) {
                    textE5.style.opacity = `${lerp(1,0,(p-0.2)*1.25)}`
                    textE5.style.transform = `translateX(${-(p-0.2)*1.25 * 400+300}px) translateY(${p *  window.innerHeight}px)` 
                }
                const textE6 = document.querySelector('.view10--content1') as HTMLElement
                if (textE6) {
                    textE6.style.opacity = `${lerp(1,0,(p-0.4)*1.666)}`
                    textE6.style.transform = `translateX(${-(p-0.4)*1.666 * 800+266.88}px) translateY(${p *  window.innerHeight}px)` 
                }
                const textE7 = document.querySelector('.view10--content2') as HTMLElement
                if (textE7) {
                    textE7.style.opacity = `${lerp(1,0,(p-0.6)*2.5)}`
                    textE7.style.transform = `translateX(${-(p-0.6)*2.5 * 800-400}px) translateY(${p *  window.innerHeight}px)` 
                }
                const textE8 = document.querySelector('.view10--content3') as HTMLElement
                if (textE8) {
                    textE8.style.opacity = `${lerp(1,0,(p-0.8)*5)}`
                    textE8.style.transform = `translateX(${-(p-0.8)*5 * 800-2400}px) translateY(${p *  window.innerHeight}px)` 
                }
                onUpdate()
            }
        })

        if(!isMobile){
            const sections = document.querySelectorAll('.section')
            const sectionTops: number[] = []
            sections.forEach(section=> {
                sectionTops.push(section.getBoundingClientRect().top)
            })
            setupCustomWheelSmoothScrolling(viewer, document.documentElement, sectionTops, )
        }
        else {
            createStyles(`
    html, body {
      scroll-snap-type: y mandatory;
    }
    
            `)
        }

    }

    function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t
    }
    
    //更新页面

    function onUpdate(){
        needsUpdate = true;
    }


    viewer.addEventListener('preFrame', ()=>{
        if(needsUpdate){
            camera.positionUpdated(false)
            camera.targetUpdated(true)
            needsUpdate = false;
        }

    })

    // 了解更多
    document.querySelector('.button-know-more')?.addEventListener('click', () => {
        const element = document.querySelector('.cam-view-2')
        window.scrollTo({top: element?.getBoundingClientRect().top, left: 0, behavior: 'smooth'})
    })
    //滚动吸附
    function setupCustomWheelSmoothScrolling(viewer: ViewerApp, element: HTMLElement, snapPositions: number[], speed = 1.5){
        let customScrollY = element.scrollTop
        let frameDelta = 0
        let scrollVelocity = 0
    
        window.addEventListener('wheel', (e: WheelEvent)=>{
            e.preventDefault()
            e.stopPropagation()
            // todo: check delta mode?
            frameDelta = Math.min(Math.max(e.deltaY * speed, -window.innerHeight / 3), window.innerHeight / 3)
            return false
        }, {passive: false})
    
    
        const idleSpeedFactor = 0.05
        const snapSpeedFactor = 0.4
        const snapProximity = window.innerHeight / 4
        const wheelDamping = 0.25
        const velocityDamping = 0.2
    
        viewer.addEventListener('preFrame', ()=>{
                if (Math.abs(frameDelta) < 1) {
                    const nearestSection = snapPositions.reduce((prev, curr) => Math.abs(curr - customScrollY) < Math.abs(prev - customScrollY) ? curr : prev)
                    const d = nearestSection - customScrollY
                    scrollVelocity = d * (Math.abs(d) < snapProximity ? snapSpeedFactor : idleSpeedFactor);
                }
                scrollVelocity += frameDelta * wheelDamping
                frameDelta *= (1.-wheelDamping)
                if (Math.abs(frameDelta) < 0.01) frameDelta = 0
                if (Math.abs(scrollVelocity) > 0.01) {
                    customScrollY = Math.max(customScrollY + scrollVelocity * velocityDamping, 0)
                    element.scrollTop = customScrollY
                    scrollVelocity *= (1.-velocityDamping)
                    ScrollTrigger.update();
                } else {
                    scrollVelocity = 0
                }
    
        })
    
    }


}


setupViewer()
