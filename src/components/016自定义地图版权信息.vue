/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-11
*/

<template>
    <div class="container">
        <h3>vue+openlayers：自定义修改版权信息</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <div id="vue-openlayers" class="map-x"></div>
    </div>
</template>
<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import {OSM } from 'ol/source'
//以下代码行为关注点

    export default {
        name: 'zoom',
        data() {
            return {
                map: null
            }
        },
        methods: {
            initMap() {
 //核心代码				
let attributions =
  '<a href="https://xiaozhuanlan.com/vue-openlayers" target="_blank">&copy; 个性化版权信息</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
				
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new OSM({
								attributions: attributions, //核心代码
							})
                        })
                    ],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [114.064839, 22.548857],
                        zoom: 4
                    }),

                })
            }
        },
        mounted() {
            this.initMap()
        }
    }
</script>

<style scoped>
    .container{
        width: 840px;
        height: 520px;
        margin: 0 auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        border: 1px solid #42B983;
    }
</style>
