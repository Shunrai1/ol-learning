
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-22
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 绘制多边形，drawend获取到多边形的所有点坐标</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            <el-button type="primary" size="mini" @click="drawPolygon('Rectangle')">绘制矩形</el-button>
        </h4>
        <div id="vue-openlayers"></div>
		<div class="list">
			<p v-for="( item ,index ) in coordinates" :key="index">P{{index+1}} : {{ item }}</p>
		</div>
    </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map,View} from "ol";
    import XYZ from "ol/source/XYZ";
    import TileLayer from "ol/layer/Tile"
    import Feature from 'ol/Feature'
    import LayerVector from 'ol/layer/Vector'
    import SourceVector from 'ol/source/Vector'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Text from 'ol/style/Text'
    import Style from 'ol/style/Style'
    import Circle from 'ol/style/Circle'
    import Draw from 'ol/interaction/Draw'
    import MultiPoint from 'ol/geom/MultiPoint';
    import {Point,Polygon} from "ol/geom"

    export default {
        name: "DrawToGetCoordinates",
        data() {
            return {
                map: null,
                osmLayer: null,
                draw: null,
                source: new SourceVector({wrapX: false}),
				coordinates:[],
            }
        },
        mounted() {
            this.initMap();
        },
        methods: {

            drawPolygon(x) {
                // 清除资源,只留一个图形
                this.source.clear()
                // 停止上一次的绘制，没有此代码会出现重叠
                if (this.draw !== null) {
                    this.map.removeInteraction(this.draw)
                }
                this.draw = new Draw({
                    source: this.source,
                    type:'Polygon',
                })
                this.map.addInteraction(this.draw)

                this.draw.on('drawend', e => {
                    let feature = e.feature;
                    let geom = feature.getGeometry();
					let arr=geom.getCoordinates()[0]
					// 去掉第一个点,因为第一个点和最后一点重复
                    this.coordinates = arr.filter((element, index) => index > 0);
                    this.map.removeInteraction(this.draw)
                })
            },

            initMap() {
                this.osmLayer = new TileLayer({
                    source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
                })

                let drawLayer = new LayerVector({
                    source: this.source,
                    style: [
                        new Style({
                            fill: new Fill({
                                color: 'transparent'
                            }),
                            stroke: new Stroke({
                                width: 2,
                                color: "blue",
                            }),
                        }),
                        new Style({
                            image: new Circle({
                                radius: 5,
                                fill: new Fill({
                                    color: 'red'
                                }),
                                stroke: new Stroke({
                                    color: 'orange',
                                    width: 2
                                })
                            }),
                            geometry: function(feature) {
                                var coordinates = feature.getGeometry().getCoordinates()[0];
                                return new MultiPoint(coordinates);
                            }
                        }),

                    ]
                });

                this.map = new Map({
                    layers: [this.osmLayer, drawLayer],
                    view: new View({
                        center: [116, 39.5],
                        zoom: 8,
                        projection: 'EPSG:4326',
                    }),
                    target: 'vue-openlayers'
                })
            }
        },

    }
</script>

<style scoped>
    .container {
        width: 840px;
        height: 570px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 620px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
        float: left;
    }
    .list {
        width: 200px;
        height: 400px;
        margin: 0 auto;
        float: right;
        overflow-y: auto;
    }
	.list p{ font-size: 12px;}
</style>
