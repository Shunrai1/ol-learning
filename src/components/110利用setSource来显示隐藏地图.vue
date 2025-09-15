
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-25
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 利用setSource显示隐藏地图</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="yes">显示</el-button>
			<el-button type="primary" size="mini" @click="no">不显示</el-button>
		</h4>
        <div id="vue-openlayers"></div>
    </div>
</template>
<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
    import {transform } from 'ol/proj'
    export default {
        name: 'show',
        data() {
            return {
                map: null,
				source: new OSM(),				
				layer:new TileLayer(),
            }
        },
        methods: {
            yes(){this.layer.setSource(this.source);},
			no(){this.layer.setSource(null);},
            initMap() {
                this.map = new Map({
                    layers: [
                       this.layer 
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
			this.yes();
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
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>
