
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-12
*/


<template>
    <div class="container">
        <h3>vue+openlayers: 鼠标点击播放视频</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
        <div id="vue-openlayers"></div>

        <div id="popup-box" class="ol-popup">
            <div id="popup-content">
               <video id="videoid" width="202" height="184" controls="controls" autoplay>
               	  <source src="" type="video/mp4" ></source>
               </video>
            </div>
        </div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM'
    import Overlay from 'ol/Overlay';
    import {fromLonLat,toLonLat,transform} from "ol/proj";
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import Style from 'ol/style/Style'
    import Icon from 'ol/style/Icon'
    import Text from 'ol/style/Text'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Feature from 'ol/Feature'
    import {Point} from "ol/geom"

    export default {
        data() {
            return {
                map: null,
                overlayer: null,
                vsource: new VectorSource({}),
                cimgurl:null,
                cname:'',
                caddress:'',
                citys: [
                    {
                        name: '大剑师航空科技集团',
                        position: [116.00, 39.80],
                        videourl: "/data/redar.mp4",
                        imgurl: require('@/assets/img/rocket.png')
                    },

                ]
            }
        },
        methods: {
            // 城市点层 
            companyPoint() {
                let features = [];
                let data = this.citys;
                for (var i = 0; i < data.length; i++) {
                    let feature = new Feature({
                        geometry: new Point(data[i].position),
                        citydata: data[i],
                    })
                    let img=data[i].imgurl;
                    feature.setStyle(this.pointStyle(img))
                    features.push(feature)
                }
                this.vsource.addFeatures(features)
            },
            // 点的样式
            pointStyle(img) {
                let Styles = []
                Styles.push(
                    new Style({
                        // 设置图标
                        image: new Icon({
                            src: img,
                            anchor: [0.5, 0.5],
                            scale: 0.4,
                        }),
                    })
                )
                return Styles
            },
            // hover显示城市信息  
            clickPoint() {
                // 设置浮层
                const box = document.getElementById('popup-box');
                this.overlayer = new Overlay({
                    element: box,
                    autoPan: {
                        animation: {
                            duration: 250,
                        },
                    },
                });
                this.map.addOverlay(this.overlayer);

                // 显示内容
                let _that = this;
                this.map.on('singleclick', (e) => {
                    let feature = this.map.forEachFeatureAtPixel(
                        e.pixel,
                        (feature, layer) => {
                            return feature
                        }
                    )
                    if (feature) {
                        let cityInfo = feature.get('citydata')
                        _that.cname = cityInfo.name;
                        _that.cimgurl = cityInfo.imgurl;
                        _that.overlayer.setPosition(e.coordinate);
						document.getElementById("videoid").src = cityInfo.videourl;

                    } else {
                        _that.overlayer.setPosition(undefined);
                    }
                });
            },
       // 初始化地图
            initMap() {
                let osmLayer = new Tile({
                    source: new OSM(),
                });
                let cityLayer = new VectorLayer({
                    source: this.vsource,
                });

                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        osmLayer,
                        cityLayer
                    ],
                    view: new View({
                        center: [116.389, 39.903],
                        zoom: 6,
                        projection: 'EPSG:4326'
                    })
                });
                this.clickPoint();
            },
        },
        mounted() {
            this.initMap();
            this.companyPoint();
        }
    }
</script>
<style scoped>
    .container {
        width: 840px;
        height: 590px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }

    #vue-openlayers {
        width: 800px;
        height: 470px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }

    .ol-popup {
        position: absolute;
        background-color: rgba(255, 0, 255, 0.8);
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        color: #FFFFFF;
        min-width: 200px;
    }

    .ol-popup:after,
    .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .ol-popup:after {
        border-top-color: rgba(255, 0, 255, 0.8);
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
    }

    .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
    }
    #popup-content{ width: 202px; height: 184px; border-radius: 10px; border:1px solid #fff;padding: 10px;}

</style>


