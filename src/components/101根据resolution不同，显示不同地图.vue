
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-08-24
*/

<template>
    <div class="container">
        <h3>vue+openlayers: 根据Resolution的不同，显示不同的地图</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            Resolution分界点：3000， 当前Resolution值：{{cResolution}}
        </h4>
        <div id="vue-openlayers"></div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM'
    import Stamen from 'ol/source/Stamen';
    export default {
        data() {
            return {
                map: null,
                cResolution: 6,
            }
        },
        methods: {
            moveendEvent() {
                this.map.on('moveend', (e) => {
					let temp=this.map.getView().getResolution().toFixed(0);
                    this.cResolution = temp
                });
            },
            initMap() {
                let osmLayer = new Tile({
                    source: new OSM(),
                    minResolution: 30,
                    maxResolution: 3000,
                });
                let StamenLayer = new Tile({
                    source: new Stamen({
                        layer: "watercolor",
                    }),
                    minResolution: 3000,
                    maxResolution: 30000,
                });
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [
                        osmLayer,
                        StamenLayer
                    ],
                    view: new View({
                        center: [663600, 4723680],
                        zoom: 6,
                        projection: 'EPSG:3857'
                    })
                });
                this.moveendEvent()
            },
        },
        mounted() {
            this.initMap();
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
        height: 420px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
</style>

