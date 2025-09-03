/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-24
*/
<template>
    <div class="container">
        <h3>vue+openlayers: 读取WKB数据，显示图形</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
        <div id="vue-openlayers"></div>
        <div id="info"></div>
    </div>
</template>
<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
    import VectorLayer from 'ol/layer/Vector'
    import VectorSource from 'ol/source/Vector'
    import {transform} from 'ol/proj';
    import Feature from 'ol/Feature'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Style from 'ol/style/Style'
    import Circle from 'ol/style/Circle'

    // 核心代码块
	import WKB from 'ol/format/WKB';

    export default {
        name: 'read-WKB',
        data() {
            return {
                map: null,
                source: new VectorSource({wrapX: false }),
				wkb:'0103000000010000000500000054E3A59BC4602540643BDF4F8D1739C05C8FC2F5284C4140EC51B81E852B34C0D578E926316843406F1283C0CAD141C01B2FDD2406012B40A4703D0AD79343C054E3A59BC4602540643BDF4F8D1739C0'
            }
        },
        methods: {

            readWKB(){
				const format = new WKB();				
				const feature = format.readFeature(this.wkb, {
				  dataProjection: 'EPSG:4326',
				  featureProjection: 'EPSG:3857',
				});
				
                this.source.addFeature(feature);
            },

            initMap() {

                this.map = new Map({
                    layers: [
                        new TileLayer({
                            source: new OSM()
                        }),
                        new VectorLayer({
                            source:this.source,
                            style:new Style({
                                  fill:new Fill({
                                      color:"orange",
									  opacity:0.4
                                  }),
                                  stroke:new Stroke({
                                      width:2,
                                      color:"#ff0",
                                  }),
                                  image: new Circle({  //点样式
                                    radius: 5, 
                                    fill: new Fill({
                                      color: '#ff0000'
                                    })
                                  }),
                            })
                        }),  
                    ],
                    target: 'vue-openlayers',
                    view: new View({
                        center: transform([86, -37.0902],"EPSG:4326","EPSG:3857"),
                        projection: "EPSG:3857",
                        zoom: 2,
                    }),
                });

            },
        },
        mounted() {
            this.initMap();
            this.readWKB();
        },
    }
</script>

<style scoped>
    .container {
        width: 840px;
        height: 520px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>

