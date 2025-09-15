
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-06
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 使用declutter，避免文字标签重叠</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM';
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import Style from 'ol/style/Style'
    import Icon from 'ol/style/Icon'
    import Text from 'ol/style/Text'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Feature from 'ol/Feature'
    import {Point,LineString,Polygon} from "ol/geom"
    import DateExtent from "@/assets/js/DateExtent.js"
    export default {
        data() {
            return {
                map: null,
                trackSource: new VectorSource(),
                markersData: [
                    [111.44, 24.18, 1604627953],
                    [112.26, 24.48, 1604714353],
                    [113.96, 24.65, 1604800753],
                    [113.44, 24.78, 1604887153],
                    [113.44, 24.98, 1605059953],
                    [113.54, 25.68, 1605146353]
                ],
            }
        },
        methods: {

            setTrackStyle(text, img) {
                let Styles = []
                Styles.push(
                    new Style({
                        // 设置图标
                        image: new Icon({
                            src: img,
                            anchor: [0.5, 0.5],
                            scale: 1,
                        }),
                        // 设置图片下面显示字体的样式和内容
                        text: new Text({
                            font: '12px sans-serif', // 设置字体
                            maxAngle: 30,
                            offsetx: 50, // 设置文字偏移量
                            offsetY: 20,
                            text: text, // 文字描述
                            fill: new Fill({
                                color: '#fff',
                            }),
                            backgroundFill: new Fill({
                                color: 'rgba(255,0,0,0.6)'
                            }),
                            backgroundStroke: new Stroke({
                                color: 'rgba(255,0,0,0.6)',
                                width: 8,
                            }),

                        }),
                    })
                )
                return Styles
            },
            showTrace(data) {
                var LineStringFeature = new Feature(
                    new LineString(data));
                LineStringFeature.setStyle(new Style({
                    stroke: new Stroke({
                        color: '#00f',
                        width: 2
                    })
                }))
                this.trackSource.addFeature(LineStringFeature);

                let features = []
                let img = ''
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        img = require('@/assets/img/startPoint.png')
                    } else if (i == data.length - 1) {
                        img = require('@/assets/img/endPoint.png')
                    } else {
                        img = require('@/assets/img/point.png')
                    }
                    // 创建 Feature
                    let feature = new Feature({
                        geometry: new Point([data[i][0], data[i][1]]),
                        data: data[i], 
                    })
                    let time = new Date(data[i][2] * 1000).Format("yyyy-MM-dd");
                    feature.setStyle(this.setTrackStyle("时间:" + time, img)) 
                    features.push(feature)
                }
                this.trackSource.addFeatures(features)
            },

            initMap() {
              let OSMlayer = new Tile({
                  source: new OSM(),

              })
              let trackLayer = new VectorLayer({
                  source: this.trackSource,
				  declutter: true, //重要的一行，确保label不重叠
              })
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [OSMlayer,trackLayer],
                    view: new View({
                        center: [113.448, 23.986],
                        zoom: 7,
                        projection: "EPSG:4326",
                    }),
                })
               
            },

        },
        mounted() {
            this.initMap();
			this.showTrace(this.markersData)
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

</style>

