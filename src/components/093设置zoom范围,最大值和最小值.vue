/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-14
*/

<template>
    <div class="container">
        <h3>vue+openlayers：设置ZOOM限定，最小9级，最大13级</h3>
        <p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
        <div id="vue-openlayers" class="map-x"></div>
    </div>
</template>
<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import {OSM } from 'ol/source'
    export default {
        name: 'zoom',
        data() {
            return {
                map: null,
            }
        },
        methods: {

            initMap() {
                this.map = new Map({
                    target: 'vue-openlayers',
                    layers: [
                        new Tile({
                            source: new OSM()
                        })
                    ],
                    view: new View({
                        projection: "EPSG:4326",
						center:[116,39],
						zoom: 11,
						minZoom: 9,
						maxZoom: 13,
                    }),
                 
                })

            }
        },
        mounted() {
            this.initMap();         
        },

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
